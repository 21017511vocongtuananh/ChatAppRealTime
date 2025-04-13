package com.Chat.Chat.service.Impl;

import com.Chat.Chat.dto.reponse.MessageResponse;
import com.Chat.Chat.dto.request.MessageRequest;
import com.Chat.Chat.exception.ErrorCode;
import com.Chat.Chat.exception.ErrorException;
import com.Chat.Chat.mapper.MessageMapper;
import com.Chat.Chat.model.Conversation;
import com.Chat.Chat.model.DeletedMessage;
import com.Chat.Chat.model.Message;
import com.Chat.Chat.model.User;
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
		Message savedMessage = messageRepo.save(message);

		Conversation conversation = conversationRepo.findById(conversationId)
				.orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND,"Conversation not found"));
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
				.orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND, "Conversation not found"));
		List<String> messageIds = conversation.getMessagesIds();
		if (messageIds.isEmpty()) {
			throw new ErrorException(ErrorCode.NOT_FOUND, "No messages found in this conversation.");
		}
		String lastMessageId = messageIds.get(messageIds.size() - 1);
		Message lastMessage = messageRepo.findById(lastMessageId)
				.orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND, "Message not found"));
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

		List<Message> allMessages = messageRepo.findByConversationId(
				conversationId,
				Sort.by(Sort.Direction.ASC, "createdAt")
		);
		List<MessageResponse> result = new ArrayList<>();
		for (Message message : allMessages) {
			boolean isDeletedByUser = currentUser.getDeletedMessageIds().contains(message.getId());

			if (!isDeletedByUser) {
				MessageResponse response = messageMapper.toMessageResponse(message);
				result.add(response);
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
		message.setRecalling(true);
		messageRepo.save(message);
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
		if (!message.isRecalling()) {
			throw new ErrorException(ErrorCode.BAD_REQUEST, "Tin nhắn không đang thu hồi");
		}
		message.setRecalling(false);
		messageRepo.save(message);
		return messageMapper.toMessageResponse(message);
	}

	@Async
	public void scheduleMessageDeletion(String messageId, String userId) {
		ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
		scheduler.schedule(() -> {
			try {
				Optional<Message> messageOpt = messageRepo.findById(messageId);
				if (messageOpt.isPresent() && messageOpt.get().isRecalling()) {
					Message message = messageOpt.get();
					message.setDeleted(false);
					message.setRecalling(true);
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

