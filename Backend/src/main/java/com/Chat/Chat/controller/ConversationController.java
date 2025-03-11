package com.Chat.Chat.controller;

import com.Chat.Chat.dto.reponse.ConversationResponse;
import com.Chat.Chat.dto.request.ApiResource;
import com.Chat.Chat.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/conversation")
@RequiredArgsConstructor
public class ConversationController {
	private final ConversationService conversationService;

	@GetMapping()
	public ApiResource<List<ConversationResponse>> getConversation(){
		return ApiResource.ok(conversationService.getConversations(),"SUCCESS");
	}

	@PostMapping("/{conversationId}")
	public ApiResource<ConversationResponse> getConversationId(@PathVariable String conversationId)
	{
		return ApiResource.ok(conversationService.getConversationId(conversationId),"SUCCESS");
	}


//	@PostMapping("/create")
//	public ResponseEntity<Response> createConversation(ConversationDto conversationDto){
//		return ResponseEntity.ok(conversationService.createConversation(conversationDto));
//	}
}
