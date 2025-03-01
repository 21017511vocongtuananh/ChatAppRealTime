package com.Chat.Chat.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserRequest {
	@NotBlank(message = "Tên không được để trống")
	private String name;

	@NotBlank(message = "Số điện thoại không được để trống")
	@Size(min = 10, max = 10, message = "Số điện thoại phải có đúng 10 chữ số")
	@Pattern(regexp = "^[0-9]+$", message = "Số điện thoại chỉ được chứa chữ số")
	private String phoneNumber;

	@NotBlank(message = "Email không được để trống")
	@Email(message = "Email phải là một địa chỉ hợp lệ")
	@Size(max = 255, message = "Email không được vượt quá 255 ký tự")
	private String email;

	@NotBlank(message = "Mật khẩu không được để trống")
	private String password;

	@NotBlank(message = "URL hình ảnh không được để trống")
	private String image;

	@NotNull(message = "Ngày sinh không được để trống")
	private LocalDate dateOfBirth;

}
