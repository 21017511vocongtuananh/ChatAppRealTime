package com.Chat.Chat.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "deleted_messages")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DeletedMessage {

	@Id
	private String id;
	@Field("messageId")
	private String messageId;
	@Field("deletedBy")
	private String deletedBy;
	@Field("deletedAt")
	private LocalDateTime deletedAt = LocalDateTime.now();

}
