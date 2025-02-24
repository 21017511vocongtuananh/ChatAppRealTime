package com.Chat.Chat.dto.request;

import com.Chat.Chat.model.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
@NoArgsConstructor
public class MessageDto {
	private String id;
	private String body;
	private String image;
	private LocalDateTime createdAt;
	private ConversationDto conversation;
	private User sender;
	private List<User> seenUsers;
}
