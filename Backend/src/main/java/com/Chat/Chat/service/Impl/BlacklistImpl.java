package com.Chat.Chat.service.Impl;

import com.Chat.Chat.dto.request.BlacklistTokenRequest;
import com.Chat.Chat.exception.ErrorCode;
import com.Chat.Chat.exception.ErrorException;
import com.Chat.Chat.model.BlacklistedToken;
import com.Chat.Chat.repository.BlacklistedTokenRepository;
import com.Chat.Chat.security.JwtUtils;
import com.Chat.Chat.service.BlacklistService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.Date;

@Service
@Slf4j
@RequiredArgsConstructor
public class BlacklistImpl implements BlacklistService {

	private final JwtUtils jwtUtils;
	private final BlacklistedTokenRepository blacklistedTokenRepository;

	@Override
	public Object create(BlacklistTokenRequest request) {
			if (blacklistedTokenRepository.existsByToken(request.getToken())) {
				throw new ErrorException(ErrorCode.ALREADY_EXISTS, "Token này đã có trong danh sách blacklist");
			}
			Claims claims = jwtUtils.extractAllClaims(request.getToken());
			Object rawUserId = claims.get("id");
			String userId = (rawUserId != null) ? rawUserId.toString() : null;

			Date expiration = claims.getExpiration();
			if (expiration == null) {
				throw new ErrorException(ErrorCode.BAD_REQUEST, "Token không có thời gian hết hạn.");
			}

			BlacklistedToken blacklistedToken = new BlacklistedToken();
			blacklistedToken.setToken(request.getToken());
			blacklistedToken.setUserId(userId);
			blacklistedToken.setExpiryDate(expiration.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
			return blacklistedTokenRepository.save(blacklistedToken);

	}

}
