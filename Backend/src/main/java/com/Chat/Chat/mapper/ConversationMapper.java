package com.Chat.Chat.mapper;

import com.Chat.Chat.dto.reponse.ConversationResponse;
import com.Chat.Chat.dto.reponse.MessageResponse;
import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.model.Conversation;
import com.Chat.Chat.model.Message;
import com.Chat.Chat.model.User;
import com.Chat.Chat.repository.MessageRepo;
import com.Chat.Chat.repository.UserRepo;
import io.jsonwebtoken.lang.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class ConversationMapper {
	private final UserRepo userRepo;
	private final MessageRepo messageRepo;

	public ConversationResponse toConversationResponse(Conversation conversation) {
		List<UserResponse> users = conversation.getUsersIds().stream()
				.map(id -> {
					Optional<User> userOpt = userRepo.findById(id);
					if (userOpt.isEmpty()) {
						return null;
					}
					User user = userOpt.get();
					return UserResponse.builder()
							.name(user.getName())
							.phoneNumber(user.getPhoneNumber())
							.image(user.getImage())
							.build();
				})
				.collect(Collectors.toList());
		List<MessageResponse> messages = conversation.getMessagesIds().stream()
				.map(id -> {
					Optional<Message> messageOpt = messageRepo.findById(id);
					if (messageOpt.isEmpty()) {
						return null;
					}
					Message message = messageOpt.get();
					UserResponse sender = userRepo.findById(message.getSenderId())
							.map(u -> UserResponse.builder()
									.name(u.getName())
									.phoneNumber(u.getPhoneNumber())
									.image(u.getImage())
									.build()
							)
							.orElse(null);
					List<UserResponse> seen = message.getSeenIds().stream()
							.map(seenId -> userRepo.findById(seenId)
									.map(u -> UserResponse.builder()
											.name(u.getName())
											.phoneNumber(u.getPhoneNumber())
											.image(u.getImage())
											.build()
									)
									.orElse(null))
							.collect(Collectors.toList());

					return MessageResponse.builder()
							.body(message.getBody())
							.image(message.getImage())
							.createdAt(message.getCreatedAt())
							.sender(sender)
							.seen(seen)
							.build();
				})
				.collect(Collectors.toList());

		return ConversationResponse.builder()
				.id(conversation.getId())
				.name(conversation.getName())
				.isGroup(conversation.getIsGroup())
				.createdAt(conversation.getCreatedAt())
				.lastMessageAt(conversation.getLastMessageAt())
				.users(users)
				.messages(messages)
				.build();
	}

	public ConversationResponse toConversationResponseUser(Conversation conversation) {
		List<UserResponse> users = conversation.getUsersIds().stream()
				.map(id -> {
					Optional<User> userOpt = userRepo.findById(id);
					if (userOpt.isEmpty()) {
						return null;
					}
					User user = userOpt.get();
					return UserResponse.builder()
							.name(user.getName())
							.phoneNumber(user.getPhoneNumber())
							.image(user.getImage())
							.build();
				})
				.collect(Collectors.toList());
		return ConversationResponse.builder()
				.id(conversation.getId())
				.name(conversation.getName())
				.isGroup(conversation.getIsGroup())
				.createdAt(conversation.getCreatedAt())
				.lastMessageAt(conversation.getLastMessageAt())
				.users(users)
				.build();
	}
}
