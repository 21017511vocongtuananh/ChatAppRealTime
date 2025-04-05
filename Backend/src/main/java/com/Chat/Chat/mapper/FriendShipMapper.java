package com.Chat.Chat.mapper;

import com.Chat.Chat.dto.reponse.FriendShipResponse;
import com.Chat.Chat.model.FriendShips;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class FriendShipMapper {

	public FriendShipResponse toFriendResponse(FriendShips friendShips){
		FriendShipResponse friendShipResponse = new FriendShipResponse();
		friendShipResponse.setUserId(friendShips.getUserId());
		friendShipResponse.setFriendId(friendShips.getFriendId());
		friendShipResponse.setStatus(friendShips.getStatus());
		friendShipResponse.setConversationId(friendShips.getConversationId());
		return friendShipResponse;
	}
}
