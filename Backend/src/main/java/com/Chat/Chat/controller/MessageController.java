package com.Chat.Chat.controller;

import com.Chat.Chat.dto.reponse.MessageResponse;
import com.Chat.Chat.dto.request.ApiResource;
import com.Chat.Chat.dto.request.MessageRequest;
import com.Chat.Chat.model.User;
import com.Chat.Chat.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/messages")
@Slf4j
@RequiredArgsConstructor
public class MessageController {
	private final MessageService messageService;
	private final SimpMessagingTemplate messagingTemplate;

	@GetMapping("/{conversationId}")
	public ApiResource<List<MessageResponse>> getAllMessage(@PathVariable String conversationId)
	{
		return ApiResource.ok(messageService.getAllMessage(conversationId),"SUCCESS");
	}

	@MessageMapping("/chat/{conversationId}")
	public void sendMessage(@Payload MessageRequest request,
							@DestinationVariable String conversationId,
							SimpMessageHeaderAccessor headerAccessor) {
		log.info("Received message: {}", request.getMessage());
		// Lấy user từ session attributes
		User currentUser = (User) headerAccessor.getSessionAttributes().get("CURRENT_USER");
		if (currentUser == null) {
			throw new IllegalStateException("User not found in session!");
		}
		MessageResponse savedMessage = messageService.createMessage(conversationId, request, currentUser);
		messagingTemplate.convertAndSend("/topic/conversation/" + conversationId, savedMessage);
	}
}
