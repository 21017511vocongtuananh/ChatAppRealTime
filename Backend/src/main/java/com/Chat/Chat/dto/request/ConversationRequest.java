package com.Chat.Chat.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class ConversationRequest {
	private String name;
	private List<UserRequest> users;
}
