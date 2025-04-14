package com.Chat.Chat.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class ShareMessageRequest {
	private String messageId;
	private List<String> conversationIds;
	private String body;
}
