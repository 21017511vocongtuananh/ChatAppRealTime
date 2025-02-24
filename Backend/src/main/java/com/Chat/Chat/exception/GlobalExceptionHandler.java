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
	public ResponseEntity<ApiResource> handleAllException(Exception ex, WebRequest request){
		ApiResource errorResponse = ApiResource.builder()
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.message(ex.getMessage())
				.build();
		return new ResponseEntity<>(errorResponse,HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(NotFoundException.class)
	public ResponseEntity<ApiResource> handleNotFoundException(NotFoundException ex, WebRequest request){
		ApiResource errorResponse = ApiResource.builder()
				.status(HttpStatus.NOT_FOUND)
				.message(ex.getMessage())
				.build();
		return new ResponseEntity<>(errorResponse,HttpStatus.NOT_FOUND);
	}
	@ExceptionHandler(InvalidCredentialsException.class)
	public ResponseEntity<ApiResource> handleInvalidCredentialsException(InvalidCredentialsException ex, WebRequest request){
		ApiResource errorResponse = ApiResource.builder()
				.status(HttpStatus.BAD_REQUEST)
				.message(ex.getMessage())
				.build();
		return new ResponseEntity<>(errorResponse,HttpStatus.BAD_REQUEST);
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