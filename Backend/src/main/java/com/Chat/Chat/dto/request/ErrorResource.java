package com.Chat.Chat.dto.request;

import lombok.*;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResource {
	private String message;
	private Map<String,String> errors;

}
