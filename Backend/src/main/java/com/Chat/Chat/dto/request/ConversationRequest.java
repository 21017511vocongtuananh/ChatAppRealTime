package com.Chat.Chat.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class ConversationRequest {
	@NotBlank(message = "Tên không được để trống")
	private String name;
	private List<UserRequest> users;
}
