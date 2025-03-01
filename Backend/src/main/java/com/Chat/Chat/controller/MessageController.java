package com.Chat.Chat.controller;

import com.Chat.Chat.dto.reponse.MessageResponse;
import com.Chat.Chat.dto.request.ApiResource;
import com.Chat.Chat.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/messages")
@RequiredArgsConstructor
public class MessageController {
	private final MessageService messageService;

	@PostMapping("/{conversationId}")
	public ApiResource<List<MessageResponse>> getAllMessage(@PathVariable String conversationId)
	{
		return ApiResource.ok(messageService.getAllMessage(conversationId),"SUCCESS");
	}
}
