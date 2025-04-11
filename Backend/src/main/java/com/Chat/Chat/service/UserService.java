package com.Chat.Chat.service;


import com.Chat.Chat.dto.reponse.FriendShipResponse;
import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.dto.request.ApiResource;
import com.Chat.Chat.dto.request.UpdatePassword;
import com.Chat.Chat.dto.request.UpdateUserRequest;
import com.Chat.Chat.dto.request.UserRequest;
import com.Chat.Chat.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public interface UserService {

	User getLoginUser();
	List<UserResponse> getAllUser();
	UserResponse getByPhoneNumBer();
	List<UserResponse> getOnlineUsers();
	UserResponse getPhoneUserFriend(String phoneNumber);
	UserResponse updateUser(String userId,MultipartFile imageFile, UpdateUserRequest userRequest);
	UserResponse updatePassword(String userId, UpdatePassword newPassword);
}


