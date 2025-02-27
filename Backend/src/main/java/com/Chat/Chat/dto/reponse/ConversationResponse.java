package com.Chat.Chat.dto.reponse;

import com.Chat.Chat.model.Message;
import com.Chat.Chat.model.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ConversationResponse {
	private String id;
	private String name;
	private Boolean isGroup;
	private LocalDateTime createdAt = LocalDateTime.now();
	private LocalDateTime lastMessageAt = LocalDateTime.now();
	private List<Message> messages;
	private List<UserResponse> users;
}
