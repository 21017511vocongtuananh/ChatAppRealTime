package com.Chat.Chat.service;

import com.Chat.Chat.dto.reponse.FriendShipResponse;

import java.util.List;

public interface FriendUserService {
	FriendShipResponse sendFriendRequest(String friendId);
	FriendShipResponse acceptFriendRequest(String friendId);
	List<FriendShipResponse> getFriendUserLogin();

	public List<FriendShipResponse> getPendingRequestsForCurrentUser();
}
