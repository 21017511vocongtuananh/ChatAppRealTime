package com.Chat.Chat.service;

import com.Chat.Chat.dto.reponse.FriendResponse;
import com.Chat.Chat.dto.reponse.FriendShipResponse;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.List;

public interface FriendUserService {
	FriendShipResponse sendFriendRequest(String friendId) throws JsonProcessingException;
	FriendShipResponse acceptFriendRequest(String friendId);
	List<FriendResponse> getPendingFriendRequestsSentByUser();
	List<FriendResponse> getPendingFriendRequestsReceivedByUser(String userId);
	List<FriendResponse> getFriendAccept();
	List<FriendShipResponse> getPendingRequestsForCurrentUser();
	void unfriend( String friendId);
	void blockUser(String friendId);
	void notify(String id, String destination, Object payload);
	List<FriendShipResponse> getFriendBlock();
	FriendShipResponse deleteBlock(String friendId);

}
