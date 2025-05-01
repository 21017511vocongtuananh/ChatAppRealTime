package com.Chat.Chat.service.Impl;

import com.Chat.Chat.dto.reponse.FriendResponse;
import com.Chat.Chat.dto.reponse.FriendShipResponse;
import com.Chat.Chat.dto.request.UserRequest;
import com.Chat.Chat.enums.FriendshipStatus;
import com.Chat.Chat.enums.Role;
import com.Chat.Chat.exception.ErrorCode;
import com.Chat.Chat.exception.ErrorException;
import com.Chat.Chat.mapper.FriendShipMapper;
import com.Chat.Chat.model.Conversation;
import com.Chat.Chat.model.FriendShips;
import com.Chat.Chat.model.User;
import com.Chat.Chat.repository.ConversationRepo;
import com.Chat.Chat.repository.FriendShipRepo;
import com.Chat.Chat.repository.UserRepo;
import com.Chat.Chat.service.FriendUserService;
import com.Chat.Chat.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class FriendUserImpl implements FriendUserService {
	private final FriendShipRepo friendShipRepo;
	private final UserRepo userRepo;
	private final UserService userService;
	private final FriendShipMapper friendShipMapper;
	private final ConversationRepo conversationRepo;
	private final SimpMessagingTemplate messagingTemplate;



	@Override
	public FriendShipResponse sendFriendRequest(String friendId) {
		User loggedInUser = userService.getLoginUser();
		Optional<FriendShips> existingFriendship = friendShipRepo.findByUserIdAndFriendId(loggedInUser.getId(),friendId);
		if(existingFriendship.isPresent()){
			throw new ErrorException(ErrorCode.ALREADY_EXISTS, "Đã tồn tại mối quan hệ giữa" + loggedInUser.getId() + "và" + friendId);
		}
		FriendShips friendShip = FriendShips.builder()
				.userId(loggedInUser.getId())
				.friendId(friendId)
				.status(FriendshipStatus.PENDING)
				.build();
		friendShipRepo.save(friendShip);
		FriendShipResponse response = friendShipMapper.toFriendResponse(friendShip);
		List<FriendResponse> updatedReceived = getPendingFriendRequestsReceivedByUser(friendId);
		messagingTemplate.convertAndSendToUser(
				friendId,
				"/topic/friend-requests/received",
				updatedReceived
		);
		return	response;
	}

	@Override
	public FriendShipResponse acceptFriendRequest(String friendId) {
		User loggedInUser = userService.getLoginUser();
		String currentUserId = loggedInUser.getId();
		Optional<FriendShips> friendshipOpt = friendShipRepo.findByUserIdAndFriendId(friendId, currentUserId);
		if (friendshipOpt.isEmpty() || friendshipOpt.get().getStatus() != FriendshipStatus.PENDING) {
			throw new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy lời mời kết bạn từ " + friendId + " đến " + currentUserId);
		}
		Optional<Conversation> existingConvoOpt = conversationRepo.findPrivateConversationBetween(currentUserId, friendId);
		Conversation conversation;
		if (existingConvoOpt.isPresent()) {
			conversation = existingConvoOpt.get();
		} else {
			conversation = new Conversation();
			conversation.setIsGroup(false);
			List<Conversation.GroupMember> groupMembers = new ArrayList<>();
			groupMembers.add(new Conversation.GroupMember(currentUserId, Role.USER, LocalDateTime.now()));
			groupMembers.add(new Conversation.GroupMember(friendId, Role.USER,LocalDateTime.now()));
			conversation.setGroupMembers(groupMembers);
			conversationRepo.save(conversation);
		}
		FriendShips friendShips = friendshipOpt.get();
		friendShips.setStatus(FriendshipStatus.ACCEPTED);
		friendShips.setConversationId(conversation.getId());
		friendShipRepo.save(friendShips);
		Optional<FriendShips> reverseFriendshipOpt = friendShipRepo.findByUserIdAndFriendId(currentUserId, friendId);
		if (reverseFriendshipOpt.isEmpty()) {
			FriendShips reverseFriendShip = new FriendShips();
			reverseFriendShip.setUserId(currentUserId);
			reverseFriendShip.setFriendId(friendId);
			reverseFriendShip.setStatus(FriendshipStatus.ACCEPTED);
			reverseFriendShip.setConversationId(conversation.getId());
			friendShipRepo.save(reverseFriendShip);
		}
		List<FriendResponse> updatedReceived = getPendingFriendRequestsSentByUser();
		messagingTemplate.convertAndSendToUser(
				friendId,
				"/topic/friend-requests/sent",
				updatedReceived
		);
		return friendShipMapper.toFriendResponse(friendShips);
	}


	// loi moi da gui
	@Override
	public List<FriendResponse> getPendingFriendRequestsSentByUser() {
		User loggedInUser = userService.getLoginUser();
		List<FriendShips> friendShips = friendShipRepo.findByUserIdAndStatus(loggedInUser.getId(),FriendshipStatus.PENDING);
		List<String> friendIds = friendShips.stream().map(FriendShips::getFriendId).collect(Collectors.toList());
		List<User> friends = userRepo.findAllById(friendIds);
		Map<String, User> friendMap = new HashMap<>();
		for (User friend : friends) {
			friendMap.put(friend.getId(), friend);
		}
		List<FriendResponse> responses = new ArrayList<>();
		for (FriendShips friendship : friendShips) {
			User friend = friendMap.get(friendship.getFriendId());
			FriendResponse response = new FriendResponse();
			response.setFriendId(friend.getId());
			response.setFriendName(friend.getName());
			response.setImage(friend.getImage());
			response.setConversationId(friendship.getConversationId());
			responses.add(response);
		}
		return responses;
	}

	// loi moi nhan duoc
	@Override
	public List<FriendResponse> getPendingFriendRequestsReceivedByUser(String userId) {
		List<FriendShips> friendShips = friendShipRepo.findByFriendIdAndStatus(userId, FriendshipStatus.PENDING);
		List<String> senderIds = friendShips.stream().map(FriendShips::getUserId).collect(Collectors.toList());
		List<User> senders = userRepo.findAllById(senderIds);
		Map<String, User> senderMap = new HashMap<>();
		for (User sender : senders) {
			senderMap.put(sender.getId(), sender);
		}
		List<FriendResponse> responses = new ArrayList<>();
		for (FriendShips friendship : friendShips) {
			User sender = senderMap.get(friendship.getUserId());
			FriendResponse response = new FriendResponse();
			response.setFriendId(sender.getId());
			response.setFriendName(sender.getName());
			response.setImage(sender.getImage());
			response.setConversationId(friendship.getConversationId());
			responses.add(response);
		}
		return responses;
	}

	@Override
	public List<FriendResponse> getFriendAccept() {
		User loggedInUser = userService.getLoginUser();
		List<FriendShips> friendShips = friendShipRepo.findByUserIdAndStatus(loggedInUser.getId(),FriendshipStatus.ACCEPTED);
		List<String> friendIds = friendShips.stream().map(FriendShips::getFriendId).collect(Collectors.toList());
		List<User> friends = userRepo.findAllById(friendIds);
		Map<String, User> friendMap = new HashMap<>();
		for (User friend : friends) {
			friendMap.put(friend.getId(), friend);
		}
		List<FriendResponse> responses = new ArrayList<>();
		for (FriendShips friendship : friendShips) {
			User friend = friendMap.get(friendship.getFriendId());
			FriendResponse response = new FriendResponse();
			response.setFriendId(friend.getId());
			response.setFriendName(friend.getName());
			response.setImage(friend.getImage());
			response.setConversationId(friendship.getConversationId());
			responses.add(response);
		}
		return responses;
	}

	@Override
	public List<FriendShipResponse> getPendingRequestsForCurrentUser() {
		User currentUser = userService.getLoginUser();
		List<FriendShips> pendingRequests = friendShipRepo
				.findByFriendIdAndStatus(currentUser.getId(), FriendshipStatus.PENDING);
		return pendingRequests.stream()
				.map(friendShipMapper::toFriendResponse)
				.collect(Collectors.toList());
	}



	@Override
	public void unfriend(String friendId) {
		User currentUser = userService.getLoginUser();
		String currentUserId = currentUser.getId();

		Optional<FriendShips> relation1 = friendShipRepo.findByUserIdAndFriendId(currentUserId, friendId);
		Optional<FriendShips> relation2 = friendShipRepo.findByUserIdAndFriendId(friendId, currentUserId);
		relation1.ifPresent(friendShipRepo::delete);
		relation2.ifPresent(friendShipRepo::delete);
		Map<String, Object> payloadForCurrentUser = new HashMap<>();
		payloadForCurrentUser.put("type", "DELETE");
		payloadForCurrentUser.put("friend", friendId);
		Map<String, Object> payloadForFriend = new HashMap<>();
		payloadForFriend.put("type", "DELETE");
		payloadForFriend.put("friend", currentUserId);
		notify(currentUserId, "/topic/friend-requests/received", payloadForCurrentUser);
		notify(friendId, "/topic/friend-requests/received", payloadForFriend);
	}

	@Override
	public void blockUser(String friendId) {
		User currentUser = userService.getLoginUser();
		String currentUserId = currentUser.getId();
		FriendShips relation1 = friendShipRepo.findByUserIdAndFriendId(currentUserId, friendId).orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy lời mời kết bạn từ " + currentUserId + " đến " + friendId));
		relation1.setStatus(FriendshipStatus.BLOCKED);
		friendShipRepo.save(relation1);
	}



	@Override
	public void notify(String id, String destination, Object payload) {
		messagingTemplate.convertAndSendToUser(
				id,
				destination,
				payload
		);
	}

	@Override
	public List<FriendShipResponse> getFriendBlock() {
		User currentUser = userService.getLoginUser();
		List<FriendShips> pendingRequests = friendShipRepo
				.findByUserIdAndStatus(currentUser.getId(), FriendshipStatus.BLOCKED);
		return pendingRequests.stream()
				.map(friendShipMapper::toFriendResponse)
				.collect(Collectors.toList());
	}

	@Override
	public FriendShipResponse deleteBlock(String friendId) {
		User currentUser = userService.getLoginUser();
		String currentUserId = currentUser.getId();
		FriendShips relation1 = friendShipRepo.findByUserIdAndFriendId(currentUserId, friendId).orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy lời mời kết bạn từ " + currentUserId + " đến " + friendId));
		relation1.setStatus(FriendshipStatus.ACCEPTED);
		friendShipRepo.save(relation1);
		notify(currentUser.getId(), "/topic/friend-requests/sent", friendShipMapper.toFriendResponse(relation1));
		return friendShipMapper.toFriendResponse(relation1);
	}

}
