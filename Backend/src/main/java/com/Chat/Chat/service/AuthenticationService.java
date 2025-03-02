package com.Chat.Chat.service;

import com.Chat.Chat.dto.reponse.AuthResponse;
import com.Chat.Chat.dto.reponse.ResetPasswordResponse;
import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.dto.request.*;
import org.springframework.web.multipart.MultipartFile;

public interface AuthenticationService {


	AuthResponse loginUser(AuthRequest authRequest);

	ResetPasswordResponse resetPassword(ResetPasswordRequest request);

	UserResponse registerUser(UserRequest request, MultipartFile imageFile);
}
