package com.Chat.Chat.service.Impl;

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
import com.Chat.Chat.service.FriendUserService;
import com.Chat.Chat.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class FriendUserImpl implements FriendUserService {
	private final FriendShipRepo friendShipRepo;
	private final UserService userService;
	private final FriendShipMapper friendShipMapper;
	private final ConversationRepo conversationRepo;

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
		FriendShipResponse FriendShips = friendShipMapper.toFriendResponse(friendShip);
		return	FriendShips;
	}

	@Override
	public FriendShipResponse acceptFriendRequest(String friendId) {
		User loggedInUser = userService.getLoginUser();
		Optional<FriendShips> friendshipOpt = friendShipRepo.findByUserIdAndFriendId(loggedInUser.getId(),friendId);
		if(friendshipOpt.isPresent()){
			throw new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy lời mời kết bạn từ " + loggedInUser.getId() + " đến " + friendId);
		}
		FriendShips friendShips = friendshipOpt.get();
		friendShips.setStatus(FriendshipStatus.ACCEPTED);
		friendShipRepo.save(friendShips);
		FriendShipResponse FriendShips = friendShipMapper.toFriendResponse(friendShips);
		Conversation conversation = new Conversation();
		conversation.setIsGroup(false);
		List<Conversation.GroupMember> groupMembers = new ArrayList<>();
		groupMembers.add(new Conversation.GroupMember(loggedInUser.getId(), Role.USER));
		groupMembers.add(new Conversation.GroupMember(friendId, Role.USER));
		conversation.setGroupMembers(groupMembers);
		conversationRepo.save(conversation);
		return	FriendShips;
	}
}
