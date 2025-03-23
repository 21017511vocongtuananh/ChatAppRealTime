package com.Chat.Chat.service;


import com.Chat.Chat.dto.reponse.FriendShipResponse;
import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.dto.request.ApiResource;
import com.Chat.Chat.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public interface UserService {

	User getLoginUser();
	List<UserResponse> getAllUser();
	UserResponse getByPhoneNumBer();

//	FriendShipResponse addFriend(String userId);

}

//	User updateUser(id, updatedUser);

