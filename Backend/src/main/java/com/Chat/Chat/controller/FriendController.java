package com.Chat.Chat.controller;

import com.Chat.Chat.dto.reponse.FriendShipResponse;
import com.Chat.Chat.dto.request.ApiResource;
import com.Chat.Chat.service.FriendUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}
