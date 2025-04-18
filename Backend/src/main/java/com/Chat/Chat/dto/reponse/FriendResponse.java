package com.Chat.Chat.dto.reponse;

import lombok.Data;

@Data
public class FriendResponse {
	private String friendId;
	private String conversationId;
	private String friendName;
	private String image;
}
