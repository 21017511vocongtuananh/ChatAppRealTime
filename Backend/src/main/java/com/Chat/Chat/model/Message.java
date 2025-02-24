package com.Chat.Chat.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Document(collection = "messages")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Message {

	@Id
	private String id;

	private String body;
	private String image;
	private LocalDateTime createdAt = LocalDateTime.now();

	@DBRef
	private Conversation conversation;

	@DBRef
	private User sender;

	@DBRef
	private List<User> seenUsers;
}
