package com.Chat.Chat.controller;

import com.Chat.Chat.dto.reponse.MessageResponse;
import com.Chat.Chat.dto.request.ApiResource;
import com.Chat.Chat.dto.request.MessageRequest;
import com.Chat.Chat.dto.request.ShareMessageRequest;
import com.Chat.Chat.exception.ErrorCode;
import com.Chat.Chat.exception.ErrorException;
import com.Chat.Chat.model.SignalMessage;
import com.Chat.Chat.model.User;
import com.Chat.Chat.service.Impl.S3Service;
import com.Chat.Chat.service.MessageService;
import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/messages")
@Slf4j
@RequiredArgsConstructor
public class MessageController {
	private final MessageService messageService;
	private final SimpMessagingTemplate messagingTemplate;
	private final S3Service s3Service;

	@GetMapping("/{conversationId}")
	public ApiResource<List<MessageResponse>> getAllMessage(@PathVariable String conversationId)
	{
		return ApiResource.ok(messageService.getAllMessage(conversationId),"SUCCESS");
	}


	@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ApiResource<Map<String, String>> uploadImage(@RequestParam("photo") MultipartFile photo) {
		String url = s3Service.saveImageToS3(photo);
		return ApiResource.ok(Collections.singletonMap("url", url),"ok");
	}


	@MessageMapping("/chat/{conversationId}")
	@SendTo("/topic/conversation/{conversationId}")
	public MessageResponse sendMessage(@Payload MessageRequest request,
							@DestinationVariable String conversationId,
							SimpMessageHeaderAccessor headerAccessor) {
		log.info("Received message: {}", request.getMessage());
		User currentUser = (User) headerAccessor.getSessionAttributes().get("CURRENT_USER");
		if (request.getImage() != null && !request.getImage().isEmpty()) {
			try {
				MultipartFile file = messageService.convertBase64ToMultipartFile(request.getImage());
				String imageUrl = s3Service.saveImageToS3(file);
				request.setImage(imageUrl);
			} catch (IOException e) {
				throw new ErrorException(ErrorCode.INTERNAL_SERVER_ERROR, "Failed to upload image");
			}
		}
		MessageResponse savedMessage = messageService.createMessage(conversationId, request, currentUser);
		return savedMessage;
	}

	@MessageMapping("/call/{conversationId}")
	@SendTo("/topic/conversation/{conversationId}")
	public SignalMessage handleSignal(@DestinationVariable String conversationId,SignalMessage message) {
		return message;
	}


	@PostMapping("/{conversationId}/seen")
	public ApiResource<MessageResponse> updateMessageSeen(
			@PathVariable String conversationId) {
		MessageResponse response = messageService.updateMessage(conversationId);
		messagingTemplate.convertAndSend("/topic/conversation/" + conversationId, response);
		return ApiResource.ok(response,"SUCCESS");
	}


	@DeleteMapping("/{messageId}/xoa")
	public ApiResource<String> deleteMessage(
			@PathVariable String messageId) {
			messageService.deleteMessage(messageId);
			return ApiResource.<String>builder().message("Xóa tin nhắn thành công").build();

	}

	@DeleteMapping("/{messageId}/thu-hoi")
	public ApiResource<String> recallMessage(
			@PathVariable String messageId,
			@RequestParam String conversationId) {
			messageService.recallMessage(messageId,conversationId);
			return ApiResource.<String>builder().message("Thu hồi tin nhắn thành công").build();
	}

	@PostMapping("/{messageId}/undoRecall")
	public ApiResource<MessageResponse> undoRecallMessage(@PathVariable String messageId) {
		return ApiResource.ok(messageService.undoRecallMessage(messageId),"SUCCESS");
	}

	@PostMapping("/shareMessage")
	public ApiResource<List<MessageResponse>> shareMessage(@RequestBody ShareMessageRequest request) {
		return ApiResource.ok(messageService.shareMessage(request),"SUCCESS");
	}

	@PostMapping("/deleteHistoryMessageUser/{conversationId}")
	public ApiResource<String> deleteHistoryMessageUser(@PathVariable String conversationId) {
		messageService.deleteHistoryMessageUser(conversationId);
		return ApiResource.<String>builder().message("Xóa tin nhắn thành công").build();
	}

}
