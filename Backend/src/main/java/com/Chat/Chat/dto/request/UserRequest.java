package com.Chat.Chat.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserRequest {
	@NotBlank(message = "Name is required")
	private String name;

	@NotBlank(message = "Phone number is required")
	private String phoneNumber;

	@NotBlank(message = "Email number is required")
	private String email;

	@NotBlank(message = "Password is required")
	private String password;

	@NotBlank(message = "Image URL is required")
	private String image;

	@NotNull(message = "Date of birth is required")
	private LocalDate dateOfBirth;
}
