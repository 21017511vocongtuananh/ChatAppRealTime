package com.Chat.Chat.service;

import com.Chat.Chat.dto.reponse.AuthResponse;
import com.Chat.Chat.dto.reponse.RefreshTokenResponse;
import com.Chat.Chat.dto.reponse.ResetPasswordResponse;
import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.dto.request.*;
import com.Chat.Chat.model.User;
import org.springframework.web.multipart.MultipartFile;

public interface AuthenticationService {


	AuthResponse loginUser(AuthRequest authRequest);

	ResetPasswordResponse resetPassword(ResetPasswordRequest request);

	UserResponse registerUser(UserRequest request, MultipartFile imageFile);
	Object logOut(String token);
	void saveTokenToRedis(User user,String refresh_token);
	void invalidate_token(String refresh_token);
	boolean isTokenBlacklisted(String refresh_token);
	RefreshTokenResponse refreshToken(RefreshTokenRequest token);
}
