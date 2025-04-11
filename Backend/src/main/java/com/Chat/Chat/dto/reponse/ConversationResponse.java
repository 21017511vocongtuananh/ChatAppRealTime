package com.Chat.Chat.dto.reponse;

import com.Chat.Chat.model.Conversation;
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
	private LocalDateTime createdAt;
	private LocalDateTime lastMessageAt;
	private List<UserResponse> users;
	private List<MessageResponse> messages;
	private List<Conversation.GroupMember> groupMembers;
	private String pinnedMessageId;
}
