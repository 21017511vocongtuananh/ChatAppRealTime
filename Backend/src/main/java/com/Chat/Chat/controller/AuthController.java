package com.Chat.Chat.controller;


import com.Chat.Chat.dto.reponse.AuthResponse;
import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.dto.request.*;
import com.Chat.Chat.service.AuthenticationService;
import com.Chat.Chat.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {
	private final UserService userService;
	private final AuthenticationService authenticationService;


	@PostMapping("/register")
	public ApiResource<UserResponse> registerUser(@Valid @RequestBody UserRequest request){
		return ApiResource.ok(authenticationService.registerUser(request),"SUCCESS");
	}

	@PostMapping("/login")
	public ApiResource<AuthResponse> loginUser(@Valid @RequestBody AuthRequest authRequest)
	{
		AuthResponse authResponse = authenticationService.loginUser(authRequest);
		return ApiResource.ok(authResponse,"SUCCESS");
	}

	@PostMapping("/resetPassword")
	public ApiResource<AuthResponse> resetPassword(@Valid @RequestBody AuthRequest request) {
		return ApiResource.ok(authenticationService.resetPassword(request),"Reset password thanh cong");
	}


}
