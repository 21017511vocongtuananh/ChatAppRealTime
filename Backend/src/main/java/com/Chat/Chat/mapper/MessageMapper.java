package com.Chat.Chat.mapper;

import com.Chat.Chat.dto.reponse.MessageResponse;
import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.model.Message;
import com.Chat.Chat.model.User;
import com.Chat.Chat.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class MessageMapper {

	private final UserRepo userRepo;
	private final UserMapper userMapper;


	public MessageResponse toMessageResponse(Message message) {
		List<String> allUserIds = new ArrayList<>(message.getSeenIds());
		allUserIds.add(message.getSenderId());

		Map<String, User> userMap = userRepo.findAllById(allUserIds).stream()
				.collect(Collectors.toMap(User::getId, u -> u));

		List<UserResponse> seen = message.getSeenIds().stream()
				.map(id -> userMapper.toUserResponse(userMap.get(id)))
				.collect(Collectors.toList());

		UserResponse sender = userMapper.toUserResponse(userMap.get(message.getSenderId()));

		return MessageResponse.builder()
				.id(message.getId())
				.body(message.getBody())
				.image(message.getImage())
				.seen(seen)
				.sender(sender)
				.deleted(message.isDeleted())
				.createdAt(message.getCreatedAt())
				.conversationId(message.getConversationId())
				.build();
	}


}
