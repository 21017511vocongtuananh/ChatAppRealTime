package com.Chat.Chat.controller;


import com.Chat.Chat.dto.reponse.*;
import com.Chat.Chat.dto.request.*;
import com.Chat.Chat.service.AuthenticationService;
import com.Chat.Chat.service.BlacklistService;
import com.Chat.Chat.service.RefreshTokenService;
import com.Chat.Chat.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
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
	private final BlacklistService blacklistService;



	@PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ApiResource<UserResponse> registerUser(
			@ModelAttribute @Valid UserRequest userRequest,
			@RequestParam(value = "image", required = false) MultipartFile imageFile
	) {

			return ApiResource.ok(authenticationService.registerUser(userRequest, imageFile), "SUCCESS");
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

	@PostMapping("/blacklisted_tokens")
	public ApiResource<Object> addTokenToBlacklist(@Valid @RequestBody BlacklistTokenRequest request){
		Object result =  blacklistService.create(request);
		return ApiResource.ok(result,"Đưa thành công token vào BlacklistToken");
	}

	@PostMapping("/loggout")
	public ApiResource<Object> loggout(@RequestHeader("Authorization") String bearerToken){
		try {
			return ApiResource.ok(authenticationService.logOut(bearerToken),"Them Token Vao BlackList Thanh Cong");
		}catch (Exception e){
			return ApiResource.error("Network Error!");
		}
	}

	@PostMapping("/refresh")
	public ApiResource<RefreshTokenResponse> refreshToken(@RequestBody RefreshTokenRequest request){
		RefreshTokenResponse refresh = authenticationService.refreshToken(request);
		return ApiResource.ok(refresh, "SUCCESS");
	}

}
