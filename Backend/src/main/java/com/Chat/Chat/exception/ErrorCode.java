package com.Chat.Chat.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
	UNAUTHORIZED(401, "User is not authenticated", HttpStatus.UNAUTHORIZED),
	PHONE_NOT_FOUND(404, "PhoneNumber not found", HttpStatus.NOT_FOUND),
	USER_NOT_FOUND(404, "User not found", HttpStatus.NOT_FOUND),
	PHONE_NUMBER_ALREADY_EXISTS(400, "PhoneNumber already exists", HttpStatus.BAD_REQUEST),
	EMAIL_ALREADY_EXISTS(400, "Email already exists", HttpStatus.BAD_REQUEST),
	BAD_REQUEST(400, "Invalid username or password", HttpStatus.BAD_REQUEST),
	INTERNAL_SERVER_ERROR(500, "Something went wrong on the server", HttpStatus.INTERNAL_SERVER_ERROR),
	VALIDATION_ERROR(422, "Validation failed", HttpStatus.UNPROCESSABLE_ENTITY),
	UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
	INVALID_CREDENTIALS(401, "Invalid credentials provided", HttpStatus.BAD_REQUEST);

	private final int code;
	private final String defaultMessage;
	private final HttpStatus status;

	ErrorCode(int code, String defaultMessage, HttpStatus status) {
		this.code = code;
		this.defaultMessage = defaultMessage;
		this.status = status;
	}
}