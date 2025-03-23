package com.Chat.Chat.exception;

import com.Chat.Chat.dto.request.ApiResource;
import com.Chat.Chat.dto.request.ErrorResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResource<Object>> handleAllException(Exception ex, WebRequest request) {
		ApiResource<Object> errorResponse = ApiResource.builder()
				.code(ErrorCode.INTERNAL_SERVER_ERROR.getCode())
				.message(ErrorCode.UNCATEGORIZED_EXCEPTION.getDefaultMessage())
				.build();
		return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(ErrorException.class)
	public ResponseEntity<ApiResource<Object>> handleErrorException(ErrorException ex, WebRequest request) {
		ApiResource<Object> errorResponse = ApiResource.builder()
				.code(ex.getErrorCode().getCode())
				.message(ex.getDetail())
				.build();
		return ResponseEntity.status(ex.getStatus()).body(errorResponse);
	}
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Object> handleValidException(MethodArgumentNotValidException exception) {
		Map<String, String> errors = new HashMap<>();

		exception.getBindingResult().getAllErrors().forEach(error -> {
			String fieldName = ((FieldError) error).getField();
			String errorMessage = error.getDefaultMessage();
			errors.put(fieldName, errorMessage);
		});
		ErrorResource errorResource = new ErrorResource("co van de xay ra trong qua trinh kiem tra du lieu", errors);
		return new ResponseEntity<>(errorResource, HttpStatus.UNPROCESSABLE_ENTITY);
	}

}