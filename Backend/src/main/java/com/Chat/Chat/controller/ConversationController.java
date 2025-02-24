package com.Chat.Chat.controller;

import com.Chat.Chat.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/conversation")
@RequiredArgsConstructor
public class ConversationController {
	private final ConversationService conversationService;

//	@GetMapping()
//	public ResponseEntity<Response> getConversation(){
//		return ResponseEntity.ok(conversationService.getConversations());
//	}

//	@PostMapping("/create")
//	public ResponseEntity<Response> createConversation(ConversationDto conversationDto){
//		return ResponseEntity.ok(conversationService.createConversation(conversationDto));
//	}
}
