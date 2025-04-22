package com.Chat.Chat.controller;

import com.Chat.Chat.dto.reponse.ConversationResponse;
import com.Chat.Chat.dto.reponse.MessageResponse;
import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.dto.request.ApiResource;
import com.Chat.Chat.dto.request.ConversationRequest;
import com.Chat.Chat.dto.request.UserRequest;
import com.Chat.Chat.service.ConversationService;
import com.Chat.Chat.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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

	@PostMapping("/delete/{conversationId}")
	public ApiResource<String> deleteConversation(@PathVariable String conversationId)
	{
		conversationService.deleteConversation(conversationId);
        return ApiResource.<String>builder().message("Conversation xoa thanh cong").build();
	}

	@PostMapping("/create/conversation")
	public ApiResource<ConversationResponse> createConversation(@Valid @RequestBody ConversationRequest request)
	{
		return ApiResource.ok(conversationService.createConversation(request),"SUCCESS");
	}

	@PostMapping("/{conversationId}/pin/{messageId}")
	public ApiResource<ConversationResponse> pinMessage(@PathVariable String conversationId,@PathVariable String messageId){
		return ApiResource.ok(conversationService.pinMessage(conversationId,messageId),"SUCCESS");
	}
	@GetMapping("/{conversationId}/pin")
	public ApiResource<MessageResponse> getPinnedMessage(@PathVariable String conversationId){
		MessageResponse messageResponse = conversationService.getPinnedMessages(conversationId);
		return ApiResource.ok(messageResponse,"SUCCESS");

	}

	@DeleteMapping("/{conversationId}/delete/pin")
	public ApiResource<String> deletePinnedMessage(@PathVariable String conversationId) {
		conversationService.deletePinnedMessages(conversationId);
		return ApiResource.<String>builder().message("Xóa ghim thành công").build();
	}

	@GetMapping("/getConversationIsGroupTrue")
	public ApiResource<List<ConversationResponse>> getConversationIsGroupTrue(){
		return ApiResource.ok(conversationService.getConversationIsGroupTrue(),"SUCCESS");
	}
	@GetMapping("/getConversationIsGroupFalse")
	public ApiResource<List<ConversationResponse>> getConversationIsGroupFalse(){
		return ApiResource.ok(conversationService.getConversationIsGroupFalse(),"SUCCESS");
	}

	@PostMapping("/addUserConversation/{conversationId}")
	public ApiResource<ConversationResponse> addUserConversation(
			@PathVariable String conversationId,
			@RequestBody List<UserRequest> userIds) {
		ConversationResponse response = conversationService.addUserToConversation(conversationId, userIds);
		return ApiResource.ok(response,"SUCCESS");
	}

	@PutMapping("/exit/{conversationId}")
	public ApiResource<String> exitConversation(@PathVariable String conversationId, @RequestParam String newAdminId) {
		conversationService.exitConversation(conversationId,newAdminId);
		return ApiResource.<String>builder().message("Rời nhóm thành công").build();
	}
	@GetMapping("/getUser/{conversationId}")
	public ApiResource<List<UserResponse>> getUserInConversation(@PathVariable String conversationId) {
		return ApiResource.ok(conversationService.getUsersConversation(conversationId),"SUCCESS");
	}

	@PutMapping("/changeLeader/{conversationId}")
	public ApiResource<ConversationResponse> changeLeader(@PathVariable String conversationId, @RequestParam String newAdminId) {
		return ApiResource.ok(conversationService.changeConversationLeader(conversationId,newAdminId),"SUCCESS");
	}

	@DeleteMapping("/removeMember/{conversationId}")
	public ApiResource<String> removeMember(
			@PathVariable String conversationId,
			@RequestParam String memberId) {
		conversationService.removeMember(conversationId, memberId);
		return ApiResource.<String>builder()
				.message("Xóa thành viên thành công")
				.build();
	}
}
