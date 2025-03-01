package com.Chat.Chat.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailRequest {
	@NotBlank(message = "Email không được để trống")
	@Email(message = "Email phải là một địa chỉ email hợp lệ")
	@Size(max = 255, message = "Email không được vượt quá 255 ký tự")
	private String email;
}
