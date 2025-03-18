package com.Chat.Chat.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "blacklisted_tokens")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BlacklistedToken {
	@Id
	private String id;
	private String token;
	private String userId;
	private LocalDateTime expiryDate;
	@Field("createdAt")
	private LocalDateTime createdAt = LocalDateTime.now();
	@Field("updatedAt")
	private LocalDateTime updatedAt = LocalDateTime.now();
}
