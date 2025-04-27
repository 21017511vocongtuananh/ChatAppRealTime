package com.Chat.Chat.mapper;

import com.Chat.Chat.dto.reponse.ConversationResponse;
import com.Chat.Chat.dto.reponse.MessageResponse;
import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.model.Conversation;
import com.Chat.Chat.model.Message;
import com.Chat.Chat.model.User;
import com.Chat.Chat.repository.MessageRepo;
import com.Chat.Chat.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class ConversationMapper {

	private final UserRepo userRepo;
	private final MessageRepo messageRepo;


	public ConversationResponse toConversationResponse(Conversation conversation) {

		Set<String> allUserIds = new HashSet<>();
		conversation.getGroupMembers().forEach(member -> allUserIds.add(member.getUserId()));

		List<Message> messages = messageRepo.findAllById(conversation.getMessagesIds());
		messages.forEach(message -> {
			allUserIds.add(message.getSenderId());
			allUserIds.addAll(message.getSeenIds());
		});

		Map<String, UserResponse> userMap = userRepo.findAllById(allUserIds).stream()
				.collect(Collectors.toMap(
						user -> user.getId(),
						user -> UserResponse.builder()
								.id(user.getId())
								.name(user.getName())
								.phoneNumber(user.getPhoneNumber())
								.image(user.getImage())
								.createdAt(user.getCreatedAt())
								.build()
				));
		List<UserResponse> users = conversation.getGroupMembers().stream()
				.map(member -> userMap.get(member.getUserId()))
				.collect(Collectors.toList());

		List<MessageResponse> messageResponses = messages.stream()
				.map(message -> MessageResponse.builder()
						.id(message.getId())
						.body(message.getBody())
						.image(message.getImage())
						.createdAt(message.getCreatedAt())
						.sender(userMap.get(message.getSenderId()))
						.deleted(message.isDeleted())
						.sharedMessageId(message.getSharedMessageId())
						.seen(message.getSeenIds().stream()
								.map(userMap::get)
								.collect(Collectors.toList()))
						.type(message.getMessageType())
						.build())
				.collect(Collectors.toList());

		return ConversationResponse.builder()
				.id(conversation.getId())
				.name(conversation.getName())
				.isGroup(conversation.getIsGroup())
				.createdAt(conversation.getCreatedAt())
				.lastMessageAt(conversation.getLastMessageAt())
				.pinnedMessageId(conversation.getPinnedMessageId())
				.users(users)
				.messages(messageResponses)
				.groupMembers(conversation.getGroupMembers())
				.build();
	}

}