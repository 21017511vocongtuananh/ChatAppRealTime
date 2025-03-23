package com.Chat.Chat.service.Impl;

import com.Chat.Chat.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class RefreshTokenImpl implements RefreshTokenService {
	private final StringRedisTemplate redisTemplate;

	@Override
	public void saveToken(String key, String value, Long TTL) {
		redisTemplate.opsForValue().set(key,value,TTL, TimeUnit.MILLISECONDS);
	}

	@Override
	public String getToken(String key) {
		return redisTemplate.opsForValue().get(key);
	}
}
