package com.Chat.Chat.service;


import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.model.User;

import java.util.List;

public interface UserService {

	User getLoginUser();
	List<UserResponse> getAllUser();
	UserResponse getByPhoneNumBer();
}
