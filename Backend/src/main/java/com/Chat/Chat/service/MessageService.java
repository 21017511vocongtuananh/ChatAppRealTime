package com.Chat.Chat.service;

import com.Chat.Chat.dto.reponse.MessageResponse;

import java.util.List;

public interface MessageService {
//	Response createMessage(MessageDto messageDto);
	List<MessageResponse> getAllMessage(String conversationId);
}
