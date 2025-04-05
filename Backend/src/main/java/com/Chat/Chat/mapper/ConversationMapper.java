package com.Chat.Chat.mapper;

import com.Chat.Chat.dto.reponse.ConversationResponse;
import com.Chat.Chat.dto.reponse.MessageResponse;
import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.model.Conversation;
import com.Chat.Chat.repository.MessageRepo;
import com.Chat.Chat.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class ConversationMapper {

	private final UserRepo userRepo;
	private final MessageRepo messageRepo;

	public UserResponse toUserResponse(String userId){
		return userRepo.findById(userId)
				.map(user -> UserResponse.builder()
						.id(user.getId())
						.name(user.getName())
						.phoneNumber(user.getPhoneNumber())
						.image(user.getImage())
						.createdAt(user.getCreatedAt())
						.build())
				.orElse(null);
	}


	public ConversationResponse toConversationResponse(Conversation conversation) {
		List<UserResponse> users = conversation.getGroupMembers().stream()
				.map(groupMember -> toUserResponse(groupMember.getUserId()))
				.collect(Collectors.toList());

		List<MessageResponse> messages = conversation.getMessagesIds().stream()
				.map(id -> messageRepo.findById(id)
						.map(message -> MessageResponse.builder()
								.body(message.getBody())
								.image(message.getImage())
								.createdAt(message.getCreatedAt())
								.sender(toUserResponse(message.getSenderId()))
								.seen(message.getSeenIds().stream()
										.map(this::toUserResponse)
										.collect(Collectors.toList()))
								.build())
						.orElse(null))
				.collect(Collectors.toList());

		return ConversationResponse.builder()
				.id(conversation.getId())
				.name(conversation.getName())
				.isGroup(conversation.getIsGroup())
				.createdAt(conversation.getCreatedAt())
				.lastMessageAt(conversation.getLastMessageAt())
				.users(users)
				.messages(messages)
				.groupMembers(conversation.getGroupMembers())
				.build();
	}

	public ConversationResponse toConversationResponseUser(Conversation conversation) {
		List<UserResponse> users = conversation.getGroupMembers().stream()
				.map(groupMember -> toUserResponse(groupMember.getUserId()))
				.collect(Collectors.toList());

		return ConversationResponse.builder()
				.id(conversation.getId())
				.name(conversation.getName())
				.isGroup(conversation.getIsGroup())
				.createdAt(conversation.getCreatedAt())
				.lastMessageAt(conversation.getLastMessageAt())
				.users(users)
				.groupMembers(conversation.getGroupMembers())
				.build();
	}
}