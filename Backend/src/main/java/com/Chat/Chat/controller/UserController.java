package com.Chat.Chat.controller;

import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.dto.request.ApiResource;
import com.Chat.Chat.dto.request.UpdatePassword;
import com.Chat.Chat.dto.request.UpdateUserRequest;
import com.Chat.Chat.dto.request.UserRequest;
import com.Chat.Chat.model.User;
import com.Chat.Chat.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

	@GetMapping("/onlineUser")
	public  ApiResource<List<UserResponse>> getOnlineUsers(){
		return ApiResource.ok(userService.getOnlineUsers(),"SUCCESS");
	}

	@GetMapping("/getPhoneFriend")
	public ApiResource<UserResponse> getPhoneFriend(@RequestParam String phoneNumber){
		return ApiResource.ok(userService.getPhoneUserFriend(phoneNumber),"SUCCESS");
	}
	@PostMapping(value = "/update/{userId}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ApiResource<UserResponse> updateUser(@PathVariable String userId,@ModelAttribute @Valid UpdateUserRequest userRequest,
												@RequestParam(value = "image", required = false) MultipartFile imageFile)
	{
		return ApiResource.ok(userService.updateUser(userId,imageFile,userRequest),"SUCCESS");
	}

	@PostMapping("/updatePassword/{userId}")
	public ApiResource<UserResponse> updatePassword(@PathVariable String userId , @RequestBody @Valid UpdatePassword password){
		return ApiResource.ok(userService.updatePassword(userId,password),"SUCCESS");
	}


//	@PostMapping("/api/profile")
//	public ResponseEntity<User> saveProfile(@RequestBody User user) {
//		User savedUser = userRepository.save(user);
//		return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
//	}

}
