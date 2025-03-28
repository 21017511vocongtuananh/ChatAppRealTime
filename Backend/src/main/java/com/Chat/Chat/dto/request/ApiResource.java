package com.Chat.Chat.dto.request;

import com.Chat.Chat.dto.reponse.UserResponse;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class ApiResource<T> {
	private int code = 200;
	private String message;
	private T data;
	private LocalDateTime timestamp;
	private ErrorResource error;

	@Data
	@JsonInclude(JsonInclude.Include.NON_NULL)
	public static class ErrorResource {
		private int code;
		private String message;
		private String detail;

		public ErrorResource(String message) {
			this.message = message;
		}
		public ErrorResource(int code, String message) {
			this.code = code;
			this.message = message;
		}
		public ErrorResource(int code, String message, String detail) {
			this.code = code;
			this.message = message;
			this.detail = detail;
		}
	}

	private ApiResource() {
		this.timestamp = LocalDateTime.now();
	}

	public static <T> Builder<T> builder() {
		return new Builder<>();
	}

	public static class Builder<T> {
		private final ApiResource<T> resource;

		private Builder() {
			resource = new ApiResource<>();
		}

		public Builder<T> code(int code) {
			resource.code = code;
			return this;
		}

		public Builder<T> message(String message) {
			resource.message = message;
			return this;
		}

		public Builder<T> data(T data) {
			resource.data = data;
			return this;
		}
		public Builder<T> error(ErrorResource error) {
			resource.error = error;
			return this;
		}
		public ApiResource<T> build() {
			return resource;
		}


	}

	public static <T> ApiResource<T> ok(T data, String message) {
		return ApiResource.<T>builder()
				.code(200)
				.data(data)
				.message(message)
				.build();
	}
	public static <T> ApiResource<T> error(String message) {
		ApiResource<T> response = new ApiResource<>();
		response.setCode(500);
		response.setMessage(message);
		return response;
	}
}
