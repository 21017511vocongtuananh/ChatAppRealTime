package com.Chat.Chat.security;

import com.Chat.Chat.exception.ErrorCode;
import com.Chat.Chat.exception.ErrorException;
import com.Chat.Chat.model.User;
import com.Chat.Chat.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
	private final UserRepo userRepo;
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepo.findByPhoneNumber(username).orElseThrow(() -> new ErrorException(ErrorCode.PHONE_NOT_FOUND));
		return AuthUser.builder()
				.user(user)
				.build();
	}
}