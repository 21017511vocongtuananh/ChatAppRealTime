package com.Chat.Chat.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;
import java.util.List;


@Document(collection = "conversations")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Conversation {
	@Id
	private String id;
	private String name;
	private Boolean isGroup;
	private LocalDateTime createdAt = LocalDateTime.now();
	private LocalDateTime lastMessageAt = LocalDateTime.now();
	@DBRef
	private List<Message> messages;
	@DBRef
	private List<User> users;
}
