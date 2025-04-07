package com.Chat.Chat.controller;

import com.Chat.Chat.dto.reponse.FriendShipResponse;
import com.Chat.Chat.dto.request.ApiResource;
import com.Chat.Chat.service.FriendUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/friend")
@RequiredArgsConstructor
public class FriendController {
	private final FriendUserService friendUserService;

	@PostMapping("/sendFriend")
	public ApiResource<FriendShipResponse> sendFriend(@RequestParam String friendId){
		return ApiResource.ok(friendUserService.sendFriendRequest(friendId),"SUCCESS");
	}

	@PostMapping("/acceptFriend")
	public ApiResource<FriendShipResponse> acceptFriend(@RequestParam String friendId){
		return ApiResource.ok(friendUserService.acceptFriendRequest(friendId),"SUCCESS");
	}

	@GetMapping("/getFriendUserLogin")
	public ApiResource<List<FriendShipResponse>> getFriendUserLogin(){
		return ApiResource.ok(friendUserService.getFriendUserLogin(),"SUCCESS");
	}
}
