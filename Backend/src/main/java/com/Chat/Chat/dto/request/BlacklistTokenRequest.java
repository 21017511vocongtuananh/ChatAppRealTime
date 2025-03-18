package com.Chat.Chat.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BlacklistTokenRequest {
	@NotBlank(message = "Token khong duoc de trong")
	private String token;
}
