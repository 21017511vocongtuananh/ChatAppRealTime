package com.Chat.Chat.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserRequest {
	@NotBlank(message = "Name is required")
	private String name;

	@NotBlank(message = "Phone number is required")
	@Size(min = 10, max = 10, message = "Phone number must be exactly 10 digits")
	@Pattern(regexp = "^[0-9]+$", message = "Phone number must contain only digits")
	private String phoneNumber;

	@NotBlank(message = "Email is required")
	@Email(message = "Email must be a valid email address")
	@Size(max = 255, message = "Email must not exceed 255 characters")
	private String email;

	@NotBlank(message = "Password is required")
	private String password;

	@NotBlank(message = "Image URL is required")
	private String image;

	@NotNull(message = "Date of birth is required")
	private LocalDate dateOfBirth;
}
