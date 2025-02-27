package com.Chat.Chat.exception;

import org.springframework.http.HttpStatus;

public class ErrorException extends RuntimeException {
	private final ErrorCode errorCode;
	private final String detail;

	public ErrorException(ErrorCode errorCode, String detail) {
		super(detail != null ? detail : errorCode.getDefaultMessage());
		this.errorCode = errorCode;
		this.detail = detail;
	}
	public ErrorException(ErrorCode errorCode) {
		this(errorCode, null);
	}

	public ErrorCode getErrorCode() {
		return errorCode;
	}

	public String getDetail() {
		return detail != null ? detail : errorCode.getDefaultMessage();
	}

	public HttpStatus getStatus() {
		return errorCode.getStatus();
	}
}