package com.Chat.Chat.controller;


import com.Chat.Chat.dto.reponse.AuthResponse;
import com.Chat.Chat.dto.reponse.ResetPasswordResponse;
import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.dto.request.*;
import com.Chat.Chat.service.AuthenticationService;
import com.Chat.Chat.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {
	private final AuthenticationService authenticationService;


	@PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ApiResource<UserResponse> registerUser(
			@ModelAttribute @Valid UserRequest userRequest,
			@RequestParam(value = "image", required = false) MultipartFile imageFile
	) {
		try {
			return ApiResource.ok(authenticationService.registerUser(userRequest, imageFile), "SUCCESS");
		} catch (Exception e) {
			return ApiResource.error("Lỗi đăng ký: " + e.getMessage());
		}
	}



	@PostMapping("/login")
	public ApiResource<AuthResponse> loginUser(@Valid @RequestBody AuthRequest authRequest)
	{
		AuthResponse authResponse = authenticationService.loginUser(authRequest);
		return ApiResource.ok(authResponse,"SUCCESS");
	}

	@PostMapping("/resetPassword")
	public ApiResource<ResetPasswordResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
		return ApiResource.ok(authenticationService.resetPassword(request),"Reset password thanh cong");
	}


}
