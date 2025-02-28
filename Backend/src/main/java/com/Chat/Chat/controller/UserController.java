package com.Chat.Chat.controller;

import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.dto.request.ApiResource;
import com.Chat.Chat.model.User;
import com.Chat.Chat.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

//	@PostMapping("/api/profile")
//	public ResponseEntity<User> saveProfile(@RequestBody User user) {
//		User savedUser = userRepository.save(user);
//		return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
//	}

}
