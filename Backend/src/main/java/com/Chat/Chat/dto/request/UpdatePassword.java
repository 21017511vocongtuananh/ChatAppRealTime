package com.Chat.Chat.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdatePassword {
	@NotBlank(message = "Mật khẩu không được để trống")
	private String currentPassword;
	@NotBlank(message = "Mật khẩu mới không được để trống")
	private String newPassword;
	private String confirmNewPassword;
}
