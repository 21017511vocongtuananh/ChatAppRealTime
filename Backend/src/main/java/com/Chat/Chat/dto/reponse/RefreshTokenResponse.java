package com.Chat.Chat.dto.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class RefreshTokenResponse {
	private String token;
	private String refreshToken;
	private String name;
	private String phoneNumber;
}
