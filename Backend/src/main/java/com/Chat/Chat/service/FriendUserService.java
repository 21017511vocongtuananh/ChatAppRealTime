package com.Chat.Chat.service;

import com.Chat.Chat.dto.reponse.FriendShipResponse;

public interface FriendUserService {
	FriendShipResponse sendFriendRequest(String friendId);
	FriendShipResponse acceptFriendRequest(String friendId);
}
