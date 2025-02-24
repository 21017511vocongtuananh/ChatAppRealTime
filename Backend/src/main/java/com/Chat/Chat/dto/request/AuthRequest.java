package com.Chat.Chat.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthRequest {
	@NotBlank(message = "phoneNumber is required")
	private String phoneNumber;
	@NotBlank(message = "Password is required")
	private String password;
}
