package com.Chat.Chat.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Document(collection = "user")
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
	private String gender;
	private LocalDate dateOfBirth;
	@Field("createdAt")
	private LocalDateTime createdAt = LocalDateTime.now();

	@Field("updatedAt")
	private LocalDateTime updatedAt = LocalDateTime.now();
	@Field("deletedMessageIds")
	@Builder.Default
	private List<String> deletedMessageIds = new ArrayList<>();
}
