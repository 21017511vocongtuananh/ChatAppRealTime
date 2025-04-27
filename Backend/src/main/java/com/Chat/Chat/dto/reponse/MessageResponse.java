package com.Chat.Chat.dto.reponse;

import com.Chat.Chat.enums.MessageType;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MessageResponse {
	private String id;
	private String body;
	private String image;
	private LocalDateTime createdAt;
	private List<UserResponse> seen;
	private UserResponse sender;
	private String conversationId;
	private boolean deleted;
	private String sharedMessageId;
	private MessageType type;
}
