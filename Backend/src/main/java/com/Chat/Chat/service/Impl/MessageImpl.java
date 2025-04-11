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
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
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
			boolean isRecalled = message.isDeleted();
			if (!isDeletedByUser && !isRecalled) {
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

	@Override
	public void deleteMessage(String messageId) {
		Optional<Message> message = messageRepo.findById(messageId);
		if (!message.isPresent()) {
			throw new ErrorException(ErrorCode.NOT_FOUND,"Không tìm thấy tin nhắn");
		}
		User login = userService.getLoginUser();
		if (!login.getDeletedMessageIds().contains(messageId)) {
			login.getDeletedMessageIds().add(messageId);
			userRepo.save(login);
		}
		DeletedMessage deletedMessage = DeletedMessage.builder()
				.messageId(messageId)
				.deletedBy(login.getId())
				.deletedAt(LocalDateTime.now())
				.build();
		deletedMessageRepo.save(deletedMessage);
	}

	@Override
	public void recallMessage(String messageId) {
		Optional<Message> messageOpt = messageRepo.findById(messageId);
		if (!messageOpt.isPresent()) {
			throw new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy tin nhắn");
		}
		Message message = messageOpt.get();
		User login = userService.getLoginUser();
		if (!message.getSenderId().equals(login.getId())) {
			throw new ErrorException(ErrorCode.FORBIDDEN, "Chỉ người gửi mới có thể thu hồi tin nhắn");
		}
		long phutDaGui = ChronoUnit.MINUTES.between(message.getCreatedAt(), LocalDateTime.now());
		if (phutDaGui > 6) {
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
	}

}
