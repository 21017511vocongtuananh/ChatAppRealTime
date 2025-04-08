package com.Chat.Chat.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserRequest {

	@NotBlank(message = "Tên không được để trống")
	private String name;

	@NotNull(message = "Ngày sinh không được để trống")
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
	private LocalDate dateOfBirth;

	@NotBlank(message = "Giới tính không được để trống")
	private String gender;
}
