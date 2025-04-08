package com.Chat.Chat.mapper;

import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.dto.request.UserRequest;
import com.Chat.Chat.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
	public User toUser(UserRequest request) {
		return User.builder()
				.id(request.getId())
				.name(request.getName())
				.phoneNumber(request.getPhoneNumber())
				.email(request.getEmail())
				.gender(request.getGender())
				.password(request.getPassword())
				.dateOfBirth(request.getDateOfBirth())
				.build();
	}

	public UserResponse toUserResponse(User user)
	{
		UserResponse response = new UserResponse();
		response.setId(user.getId());
		response.setName(user.getName());
		response.setPhoneNumber(user.getPhoneNumber());
		response.setPhoneNumber(user.getPhoneNumber());
		response.setImage(user.getImage());
		response.setGender(user.getGender());
		response.setDateOfBirth(user.getDateOfBirth());
		return response;
	}
}
