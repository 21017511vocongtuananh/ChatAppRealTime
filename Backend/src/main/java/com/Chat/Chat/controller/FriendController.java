package com.Chat.Chat.controller;

import com.Chat.Chat.dto.reponse.FriendResponse;
import com.Chat.Chat.dto.reponse.FriendShipResponse;
import com.Chat.Chat.dto.request.ApiResource;
import com.Chat.Chat.service.FriendUserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/friend")
@RequiredArgsConstructor
public class FriendController {
	private final FriendUserService friendUserService;

	@PostMapping("/sendFriend")
	public ApiResource<FriendShipResponse> sendFriend(@RequestParam String friendId) throws JsonProcessingException {
		return ApiResource.ok(friendUserService.sendFriendRequest(friendId),"SUCCESS");
	}

	@PostMapping("/acceptFriend")
	public ApiResource<FriendShipResponse> acceptFriend(@RequestParam String friendId){
		return ApiResource.ok(friendUserService.acceptFriendRequest(friendId),"SUCCESS");
	}

	@GetMapping("/received-requests")
	public ApiResource<List<FriendShipResponse>> getPendingRequests() {
		return ApiResource.ok(friendUserService.getPendingRequestsForCurrentUser(), "SUCCESS");
	}

	@GetMapping("/getPendingFriendRequestsSentByUser")
	public ApiResource<List<FriendResponse>> getPendingFriendRequestsSentByUser(){
		return ApiResource.ok(friendUserService.getPendingFriendRequestsSentByUser(),"SUCCESS");
	}

	@GetMapping("/getFriend/RequestsReceivedByUser")
	public ApiResource<List<FriendResponse>> getPendingFriendRequestsReceivedByUser(@RequestParam String userId){
		return ApiResource.ok(friendUserService.getPendingFriendRequestsReceivedByUser(userId),"SUCCESS");
	}


	@PostMapping("/unfriend")
	public ApiResource<String> unfriend(@RequestParam String friendId) {
		friendUserService.unfriend(friendId);
		return ApiResource.ok("Unfriend successfully", "SUCCESS");
	}

	@GetMapping("/getFriendUserAccept")
	public ApiResource<List<FriendResponse>> getFriendUserAccept() {
		return ApiResource.ok(friendUserService.getFriendAccept(), "SUCCESS");
	}
	@PostMapping("/block")
	public ApiResource<String> exitConversation(@RequestParam String friendId) {
		friendUserService.blockUser(friendId);
		return ApiResource.<String>builder().message("Rời nhóm thành công").build();
	}

	@GetMapping("/getFriendBlock")
	public ApiResource<List<FriendShipResponse>> getFriendBlock() {
		return ApiResource.ok(friendUserService.getFriendBlock(), "SUCCESS");
	}

	@PostMapping("/delete/block")
	public ApiResource<FriendShipResponse> deleteBlock(@RequestParam String friendId) {
		return ApiResource.ok(friendUserService.deleteBlock(friendId), "SUCCESS");
	}

}

