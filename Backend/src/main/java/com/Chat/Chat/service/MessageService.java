package com.Chat.Chat.service;

import com.Chat.Chat.dto.reponse.MessageResponse;
import com.Chat.Chat.dto.request.MessageRequest;
import com.Chat.Chat.dto.request.ShareMessageRequest;
import com.Chat.Chat.model.SignalMessage;
import com.Chat.Chat.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MessageService {
	MessageResponse createMessage(String conversationId, MessageRequest request, User currentUser);
	MessageResponse updateMessage(String conversationId);
	List<MessageResponse> getAllMessage(String conversationId);
	MultipartFile convertBase64ToMultipartFile(String base64);
	void deleteMessage(String messageId);
	void recallMessage(String messageId ,String conversationId);
	MessageResponse undoRecallMessage(String messageId);
	List<MessageResponse> shareMessage(ShareMessageRequest request);
	void deleteHistoryMessageUser(String conversationId);

}
