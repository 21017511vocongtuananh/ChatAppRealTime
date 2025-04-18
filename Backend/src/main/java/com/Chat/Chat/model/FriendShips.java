package com.Chat.Chat.model;

import com.Chat.Chat.enums.FriendshipStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "friendships")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FriendShips {
	@Id
	private String id;

	@Field("userId")
	private String userId;

	@Field("friendId")
	private String friendId;

	@Field("status")
	private FriendshipStatus status;

	@Field("conversationId")
	private String conversationId;

	@Field("createdAt")
	private LocalDateTime createdAt = LocalDateTime.now();

	@Field("updatedAt")
	private LocalDateTime updatedAt = LocalDateTime.now();

}
