package com.Chat.Chat.mapper;

import com.Chat.Chat.dto.reponse.MessageResponse;
import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.model.Message;
import com.Chat.Chat.model.User;
import com.Chat.Chat.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class MessageMapper {

	private final UserRepo userRepo;


	public MessageResponse toMessageResponse(Message message)
	{
		List<UserResponse> users = message.getSeenIds().stream()
				.map(id -> {
					Optional<User> userOpt = userRepo.findById(id);
					if(userOpt.isEmpty()){
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
		UserResponse sender = userRepo.findById(message.getSenderId())
				.map(u -> UserResponse.builder()
						.name(u.getName())
						.phoneNumber(u.getPhoneNumber())
						.image(u.getImage())
						.build()
				).orElse(null);
		return MessageResponse.builder()
				.id(message.getId())
				.body(message.getBody())
				.image(message.getImage())
				.seen(users)
				.sender(sender)
				.createdAt(message.getCreatedAt())
				.build();

	}
}
