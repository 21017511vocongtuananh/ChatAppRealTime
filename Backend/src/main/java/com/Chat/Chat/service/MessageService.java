package com.Chat.Chat.service;

import com.Chat.Chat.dto.reponse.MessageResponse;
import com.Chat.Chat.dto.request.MessageDto;

import java.util.List;

public interface MessageService {
//	Response createMessage(MessageDto messageDto);
	List<MessageResponse> getAllMessage(String conversationId);
}
