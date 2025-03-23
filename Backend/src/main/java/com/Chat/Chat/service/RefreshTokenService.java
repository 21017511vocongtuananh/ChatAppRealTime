package com.Chat.Chat.service;

public interface RefreshTokenService {
	void saveToken(String key,String value,Long TTL);
	String getToken(String key);
}
