package com.Chat.Chat.service;


import com.Chat.Chat.dto.request.BlacklistTokenRequest;

public interface BlacklistService {
	Object create(BlacklistTokenRequest request);
}
