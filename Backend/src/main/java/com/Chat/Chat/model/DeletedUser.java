package com.Chat.Chat.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "deleted_users")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DeletedUser {
	@Id
	private String id;
	@Field("userId")
	private String userId;
	@Field("deletedBy")
	private String deletedBy;
	@Field("deletedAt")
	private LocalDateTime deletedAt = LocalDateTime.now();

}
