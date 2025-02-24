package com.Chat.Chat.controller;


import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.dto.request.ApiResource;
import com.Chat.Chat.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {
	private final UserService userService;


	@GetMapping("/get-all")
	public ApiResource<List<UserResponse>> getAllUser()
	{
		return ApiResource.ok(userService.getAllUser(),"SUCCESS");
	}

	@GetMapping("/get-phone")
	public  ApiResource<UserResponse> getPhone(){
		return ApiResource.ok(userService.getByPhoneNumBer(),"SUCCESS");
	}

}
