package com.Chat.Chat.service.Impl;

import com.Chat.Chat.dto.reponse.MessageResponse;
import com.Chat.Chat.dto.request.MessageRequest;
import com.Chat.Chat.dto.request.ShareMessageRequest;
import com.Chat.Chat.enums.MessageType;
import com.Chat.Chat.exception.ErrorCode;
import com.Chat.Chat.exception.ErrorException;
import com.Chat.Chat.mapper.MessageMapper;
import com.Chat.Chat.model.*;
import com.Chat.Chat.repository.ConversationRepo;
import com.Chat.Chat.repository.DeletedMessageRepo;
import com.Chat.Chat.repository.MessageRepo;
import com.Chat.Chat.repository.UserRepo;
import com.Chat.Chat.service.MessageService;
import com.Chat.Chat.service.UserService;
import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageImpl implements MessageService {

	private final MessageRepo messageRepo;
	private final MessageMapper messageMapper;
	private final ConversationRepo conversationRepo;
	private final UserService userService;
	private final UserRepo userRepo;
	private final DeletedMessageRepo deletedMessageRepo;
	private static final int RECALL_TIME_LIMIT_MINUTES = 6;
	private static final int RECALL_DELAY_SECONDS = 15;
	private final SimpMessagingTemplate messagingTemplate;


	@Override
	public MessageResponse createMessage(String conversationId, MessageRequest request, User currentUser) {
		Message message = new Message();
		message.setBody(request.getMessage());
		message.setImage(request.getImage());
		message.setConversationId(conversationId);
		message.setSenderId(currentUser.getId());
		message.setSeenIds(Collections.singletonList(currentUser.getId()));
		message.setMessageType(MessageType.TEXT);
		Message savedMessage = messageRepo.save(message);

		Conversation conversation = conversationRepo.findById(conversationId)
				.orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND,"Không tìm thấy cuộc trò chuyện"));
		List<String> messageIds = new ArrayList<>(conversation.getMessagesIds());
		messageIds.add(savedMessage.getId());
		conversation.setMessagesIds(messageIds);
		conversationRepo.save(conversation);
		return messageMapper.toMessageResponse(savedMessage);
	}

	@Override
public MessageResponse updateMessage(String conversationId) {
    User login = userService.getLoginUser();
    Conversation conversation = conversationRepo.findById(conversationId)
            .orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy cuộc trò chuyện"));
    List<String> messageIds = conversation.getMessagesIds();
    if (messageIds.isEmpty()) {
        throw new ErrorException(ErrorCode.NOT_FOUND, "Không có tin nhắn nào trong cuộc trò chuyện này.");
    }
    String lastMessageId = messageIds.get(messageIds.size() - 1);
    Message lastMessage = messageRepo.findById(lastMessageId)
            .orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy tin nhắn"));
    if (lastMessage.getSeenIds().contains(login.getId())) {
        return messageMapper.toMessageResponse(lastMessage);
    }
    lastMessage.getSeenIds().add(login.getId());
    messageRepo.save(lastMessage);
    return messageMapper.toMessageResponse(lastMessage);
}



	@Override
	public List<MessageResponse> getAllMessage(String conversationId) {
		User currentUser = userService.getLoginUser();
		Conversation conversation = conversationRepo.findById(conversationId)
				.orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy cuộc trò chuyện"));
		LocalDateTime joinTime = conversation.getGroupMembers().stream()
				.filter(member -> member.getUserId().equals(currentUser.getId()))
				.map(Conversation.GroupMember::getJoinTime)
				.findFirst()
				.orElse(LocalDateTime.now());
		List<Message> allMessages = messageRepo.findByConversationId(
				conversationId,
				Sort.by(Sort.Direction.ASC, "createdAt")
		);
		List<MessageResponse> result = new ArrayList<>();
		for (Message message : allMessages) {
			if (message.getCreatedAt().isAfter(joinTime)) {
				boolean isDeletedByUser = currentUser.getDeletedMessageIds().contains(message.getId());
				if (!isDeletedByUser) {
					MessageResponse response = messageMapper.toMessageResponse(message);
					result.add(response);
				}
			}
		}
		return result;
	}




	public MultipartFile convertBase64ToMultipartFile(String base64) throws IOException {
		String[] parts = base64.split(",");
		if (parts.length < 2) {
			throw new IllegalArgumentException("Invalid Base64 format");
		}
		String header = parts[0];
		String contentType = header.split(";")[0].replace("data:", "");
		String fileName;

		if (contentType.contains("video/mp4")) {
			fileName = "file.mp4";
		} else if (contentType.contains("application/pdf")) {
			fileName = "file.pdf";
		} else if (contentType.contains("image/png")) {
			fileName = "file.png";
		} else{
			fileName = "file.jpg";
		}
		byte[] decodedBytes = Base64.getDecoder().decode(parts[1]);
		return new MockMultipartFile("file", fileName, contentType, decodedBytes);
	}

	@Transactional
	@Override
	public void deleteMessage(String messageId) {
		Message message = messageRepo.findById(messageId)
				.orElseThrow(() -> {
					return new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy tin nhắn");
				});
		User login = userService.getLoginUser();
		if (!login.getDeletedMessageIds().contains(messageId)) {
			login.getDeletedMessageIds().add(messageId);
			userRepo.save(login);
		}
		scheduleMessageDeletion(messageId, login.getId());
	}

		@Override
		public void recallMessage(String messageId,String conversationId) {

			Message message = messageRepo.findById(messageId)
					.orElseThrow(() -> {
						return new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy tin nhắn");
					});
			User login = userService.getLoginUser();
			if (message.isDeleted()) {
				throw new ErrorException(ErrorCode.BAD_REQUEST, "Tin nhắn đã bị xóa");
			}
			long minutesPassed = ChronoUnit.MINUTES.between(message.getCreatedAt(), LocalDateTime.now());
			if (minutesPassed > RECALL_TIME_LIMIT_MINUTES) {
				throw new ErrorException(ErrorCode.BAD_REQUEST, "Đã quá thời gian thu hồi (giới hạn 6 phút)");
			}
			message.setDeleted(true);
			messageRepo.save(message);
			DeletedMessage deletedMessage = DeletedMessage.builder()
					.messageId(messageId)
					.deletedBy(login.getId())
					.deletedAt(LocalDateTime.now())
					.build();
			deletedMessageRepo.save(deletedMessage);
			messagingTemplate.convertAndSend(
					"/topic/conversation/" + conversationId,
					message
			);
		}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	@Override
	public MessageResponse undoRecallMessage(String messageId) {
		Message message = messageRepo.findById(messageId)
				.orElseThrow(() -> {
					return new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy tin nhắn");
				});
		User login = userService.getLoginUser();
		if (login.getDeletedMessageIds().contains(messageId)) {
			login.getDeletedMessageIds().remove(messageId);
			userRepo.save(login);
		}
		if (!message.getSenderId().equals(login.getId())) {
			throw new ErrorException(ErrorCode.FORBIDDEN, "Bạn không có quyền khôi phục tin nhắn này");
		}
		return messageMapper.toMessageResponse(message);
	}

	@Override
	public List<MessageResponse> shareMessage(ShareMessageRequest request) {
		User login = userService.getLoginUser();
		Message originalMessage = messageRepo.findById(request.getMessageId()).orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy tin nhắn"));
		Conversation originalConversation = conversationRepo.findById(originalMessage.getConversationId()).orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy nhóm"));
		List<String> conversationIds = request.getConversationIds();
		if (conversationIds == null || conversationIds.isEmpty()) {
			throw new ErrorException(ErrorCode.BAD_REQUEST, "Danh sách cuộc hội thoại nhận không được rỗng");
		}
		List<Conversation> targetConversations = conversationRepo.findAllById(conversationIds);
		if (targetConversations.size() != conversationIds.size()) {
			throw new ErrorException(ErrorCode.NOT_FOUND, "Một số cuộc hội thoại nhận không tồn tại");
		}
		List<Message> newMessages = new ArrayList<>();
		for (Conversation conv : targetConversations) {
			Message sharedMessage = new Message();
			sharedMessage.setConversationId(conv.getId());
			sharedMessage.setSenderId(login.getId());
			sharedMessage.setBody(originalMessage.getBody());
			sharedMessage.setImage(originalMessage.getImage());
			sharedMessage.setSharedMessageId(originalMessage.getId());
			sharedMessage.setCreatedAt(LocalDateTime.now());
			sharedMessage.setDeleted(false);
			messageRepo.save(sharedMessage);
			newMessages.add(sharedMessage);
			conv.getMessagesIds().add(sharedMessage.getId());
			conv.setLastMessageAt(LocalDateTime.now());
			conversationRepo.save(conv);
			if (request.getBody() != null && !request.getBody().trim().isEmpty()) {
				Message additionalMessage = new Message();
				additionalMessage.setConversationId(conv.getId());
				additionalMessage.setSenderId(login.getId());
				additionalMessage.setBody(request.getBody().trim());
				additionalMessage.setCreatedAt(LocalDateTime.now());
				additionalMessage.setDeleted(false);
				messageRepo.save(additionalMessage);
				newMessages.add(additionalMessage);
				conv.getMessagesIds().add(additionalMessage.getId());
				conv.setLastMessageAt(LocalDateTime.now());
				conversationRepo.save(conv);
			}
		}
		List<MessageResponse> messageResponses = newMessages.stream()
				.map(messageMapper::toMessageResponse)
				.collect(Collectors.toList());
		for (Message message : newMessages) {
			String conversationId = message.getConversationId();
			MessageResponse messageResponse = messageMapper.toMessageResponse(message);
			messagingTemplate.convertAndSend(
					"/topic/conversation/" + conversationId,
					messageResponse
			);
		}
		return messageResponses;
	}

	@Override
	public void deleteHistoryMessageUser(String conversationId) {
		User login = userService.getLoginUser();
		Conversation conversation = conversationRepo.findById(conversationId).orElseThrow(() -> {
			return new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy tin nhắn");
		});
		List<String> allMessageId = new ArrayList<>(conversation.getMessagesIds());
		login.setDeletedMessageIds(allMessageId);
		for(String message : allMessageId)
		{
			DeletedMessage deletedMessage = new DeletedMessage();
			deletedMessage.setMessageId(message);
			deletedMessage.setDeletedBy(login.getId());
			deletedMessage.setDeletedAt(LocalDateTime.now());
			deletedMessageRepo.save(deletedMessage);
		}
		userRepo.save(login);
	}



	@Async
	public void scheduleMessageDeletion(String messageId, String userId) {
		ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
		scheduler.schedule(() -> {
			try {
				Optional<Message> messageOpt = messageRepo.findById(messageId);
				if (messageOpt.isPresent()) {
					Message message = messageOpt.get();
					message.setDeleted(false);
					messageRepo.save(message);
					DeletedMessage deletedMessage = DeletedMessage.builder()
							.messageId(messageId)
							.deletedBy(userId)
							.deletedAt(LocalDateTime.now())
							.build();
					deletedMessageRepo.save(deletedMessage);
				} else {
					log.info("Message with ID: {} was not deleted (already undone or not recalling)", messageId);
				}
			} catch (Exception e) {
				log.error("Error during scheduled message deletion for ID: {}", messageId, e);
			}
		}, RECALL_DELAY_SECONDS, TimeUnit.SECONDS);
		scheduler.shutdown();
	}
	}

