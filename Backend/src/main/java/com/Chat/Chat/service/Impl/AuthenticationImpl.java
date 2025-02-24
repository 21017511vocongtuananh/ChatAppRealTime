package com.Chat.Chat.service.Impl;

import com.Chat.Chat.dto.reponse.AuthResponse;
import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.dto.request.*;
import com.Chat.Chat.exception.InvalidCredentialsException;
import com.Chat.Chat.exception.NotFoundException;
import com.Chat.Chat.mapper.UserMapper;
import com.Chat.Chat.model.User;
import com.Chat.Chat.repository.UserRepo;
import com.Chat.Chat.security.JwtUtils;
import com.Chat.Chat.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthenticationImpl implements AuthenticationService {
	private final UserRepo userRepo;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtils jwtUtils;
	private final UserMapper userMapper;

	@Override
	public UserResponse registerUser(UserRequest request) {
		if(userRepo.existsByPhoneNumber(request.getPhoneNumber())){
			throw new InvalidCredentialsException("Số điện thoại " + request.getPhoneNumber() + " đã tồn tại");
		}
		User user = userMapper.toUser(request);
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user = userRepo.save(user);
		return userMapper.toUserResponse(user);
	}


	@Override
	public AuthResponse loginUser(AuthRequest authRequest) {
		User user = userRepo.findByPhoneNumber(authRequest.getPhoneNumber()).orElseThrow(() -> new NotFoundException("PhoneNumber not found"));
		if(!passwordEncoder.matches(authRequest.getPassword(),user.getPassword()))
		{
			throw new InvalidCredentialsException("Password does not match");
		}
		String token = jwtUtils.generateToken(user);
		UserResponse userResponse = UserResponse.builder()
				.name(user.getName())
				.phoneNumber(user.getPhoneNumber())
				.email(user.getEmail())
				.image(user.getImage())
				.dateOfBirth(user.getDateOfBirth())
				.build();
		return AuthResponse.builder()
				.token(token)
				.user(userResponse)
				.build();
	}

	@Override
	public AuthResponse resetPassword(AuthRequest request) {
		User user = userRepo.findByPhoneNumber(request.getPhoneNumber()).orElseThrow(() -> new NotFoundException("Not found phone number"));
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		UserResponse userResponse = userMapper.toUserResponse(user);
		return AuthResponse.builder()
				.user(userResponse)
				.build();
	}
}
