package com.Chat.Chat.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Document(collection = "users")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {

	@Id
	private String id;
	private String name;
	private String phoneNumber;
	private String email;
	private String password;
	private String image;
	private LocalDate dateOfBirth;
	private LocalDateTime createdAt = LocalDateTime.now();
	private LocalDateTime updatedAt = LocalDateTime.now();

	@DBRef
	private List<Conversation> conversations;

	@DBRef
	private List<Message> seenMessages;

	@DBRef
	private List<Message> messages;
}
