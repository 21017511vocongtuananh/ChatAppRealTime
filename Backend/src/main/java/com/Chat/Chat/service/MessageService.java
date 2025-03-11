package com.Chat.Chat.service;

import com.Chat.Chat.dto.reponse.MessageResponse;
import com.Chat.Chat.dto.request.MessageRequest;
import com.Chat.Chat.model.User;

import java.util.List;

public interface MessageService {
	MessageResponse createMessage(String conversationId, MessageRequest request, User currentUser);
	List<MessageResponse> getAllMessage(String conversationId);
}
