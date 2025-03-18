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

@Document(collection = "video_calls")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VideoCalls {
	@Id
	private String id;

	@Field("conversationId")
	private String conversationId;

	@Field("callerId")
	private String callerId;

	@Field("participantIds")
	@Builder.Default
	private List<String> participantIds = new ArrayList<>();

	@Field("startedAt")
	private LocalDateTime startedAt = LocalDateTime.now();

	@Field("endedAt")
	private LocalDateTime endedAt;

	@Field("isActive")
	private Boolean isActive = true;
}
