package com.Chat.Chat.mapper;

import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.dto.request.UserRequest;
import com.Chat.Chat.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
	public User toUser(UserRequest request)
	{
		User user = new User();
		user.setName(request.getName());
		user.setPassword(request.getPassword());
		user.setPhoneNumber(request.getPhoneNumber());
		user.setEmail(request.getEmail());
		user.setImage(request.getImage());
		user.setDateOfBirth(request.getDateOfBirth());
		return user;
	}

	public UserResponse toUserResponse(User user)
	{
		UserResponse response = new UserResponse();
		response.setName(user.getName());
		response.setPhoneNumber(user.getPhoneNumber());
		response.setPhoneNumber(user.getPhoneNumber());
		response.setImage(user.getImage());
		response.setDateOfBirth(user.getDateOfBirth());
		return response;
	}
}
