package com.Chat.Chat.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class UserRequest {
	private String id;
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

	@NotNull(message = "Ngày sinh không được để trống")
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	private LocalDate dateOfBirth;

	@NotBlank(message = "Giới tính không được để trống")
	private String gender;

	// Constructor đã được sửa
	public UserRequest(String name,
					   String phoneNumber,
					   String email,
					   String password,
					   LocalDate dateOfBirth,
					   String gender) {
		this.name = name;
		this.phoneNumber = phoneNumber;
		this.email = email;
		this.password = password;
		this.dateOfBirth = dateOfBirth;
		this.gender = gender;
	}

	// Thêm constructor mặc định
	public UserRequest() {
	}
}