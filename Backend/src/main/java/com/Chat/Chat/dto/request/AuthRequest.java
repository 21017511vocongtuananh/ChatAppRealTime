package com.Chat.Chat.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthRequest {
	@NotBlank(message = "Số điện thoại không được để trống")
	private String phoneNumber;
	@NotBlank(message = "Mật khẩu không được để trống")
	private String password;

}
