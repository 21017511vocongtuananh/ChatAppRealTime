package com.Chat.Chat.service.Impl;

import com.Chat.Chat.dto.reponse.AuthResponse;
import com.Chat.Chat.dto.reponse.RefreshTokenResponse;
import com.Chat.Chat.dto.reponse.ResetPasswordResponse;
import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.dto.request.*;
import com.Chat.Chat.exception.ErrorCode;
import com.Chat.Chat.exception.ErrorException;
import com.Chat.Chat.mapper.UserMapper;
import com.Chat.Chat.model.User;
import com.Chat.Chat.repository.UserRepo;
import com.Chat.Chat.security.CustomUserDetailsService;
import com.Chat.Chat.security.JwtUtils;
import com.Chat.Chat.service.AuthenticationService;
import com.Chat.Chat.service.BlacklistService;
import com.Chat.Chat.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.Period;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthenticationImpl implements AuthenticationService {
	private final UserRepo userRepo;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtils jwtUtils;
	private final UserMapper userMapper;
	private final S3Service s3Service;
	private final BlacklistService blacklistService;
	private final RefreshTokenService refreshTokenService;
	private final CustomUserDetailsService customUserDetailsService;
	private final String REFRESH_TOKEN = "refresh_token:";
	private final String BLACKLISTED_TOKEN = "blacklisted_token:";

	@Override
	public UserResponse registerUser(UserRequest request, MultipartFile imageFile) {
		if (userRepo.existsByPhoneNumber(request.getPhoneNumber())) {
			throw new ErrorException(ErrorCode.PHONE_NUMBER_ALREADY_EXISTS);
		}
		if (userRepo.existsByEmail(request.getEmail())) {
			throw new ErrorException(ErrorCode.EMAIL_ALREADY_EXISTS);
		}
		// Xử lý ảnh
		LocalDate dob = request.getDateOfBirth();
		if(dob.isAfter(LocalDate.now())) {
			throw new ErrorException(ErrorCode.BAD_REQUEST, "Năm sinh không được lớn hơn năm hiện tại");
		}
		int age = Period.between(dob, LocalDate.now()).getYears();
		if(age < 18) {
			throw new ErrorException(ErrorCode.BAD_REQUEST, "Bạn phải đủ 18 tuổi để đăng ký");
		}
		String imageUrl = s3Service.saveImageToS3(imageFile);
		User user = userMapper.toUser(request);
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setImage(imageUrl);
		user.setGender(request.getGender());
		user.setDateOfBirth(request.getDateOfBirth());
		userRepo.save(user);
		return userMapper.toUserResponse(user);
	}

	@Override
	public Object logOut(String bearerToken) {
			String token = bearerToken.substring(7);
			BlacklistTokenRequest request = new BlacklistTokenRequest();
			request.setToken(token);
			return blacklistService.create(request);
	}

	@Override
	public AuthResponse loginUser(AuthRequest authRequest) {
		User user = userRepo.findByPhoneNumber(authRequest.getPhoneNumber()).orElseThrow(() -> new ErrorException(ErrorCode.PHONE_NOT_FOUND,"số điện thoại không tồn tại"));
		if(!passwordEncoder.matches(authRequest.getPassword(),user.getPassword()))
		{
			throw new ErrorException(ErrorCode.UNAUTHORIZED,"Sai mật khẩu");
		}
		String token = jwtUtils.generateToken(user);
		String refreshToken = jwtUtils.generateRefreshToken(user);
		saveTokenToRedis(user,refreshToken);
		UserResponse userResponse = UserResponse.builder()
				.id(user.getId())
				.name(user.getName())
				.phoneNumber(user.getPhoneNumber())
				.email(user.getEmail())
				.gender(user.getGender())
				.image(user.getImage())
				.gender(user.getGender())
				.dateOfBirth(user.getDateOfBirth())
				.build();
		return AuthResponse.builder()
				.token(token)
				.refreshToken(refreshToken)
				.user(userResponse)
				.build();
	}

	@Override
	public ResetPasswordResponse resetPassword(ResetPasswordRequest request) {
		User user = userRepo.findByEmail(request.getEmail()).orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND,"Email not found"));
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		userRepo.save(user);
		return ResetPasswordResponse.builder()
				.email(user.getEmail())
				.build();
	}

	@Override
	public RefreshTokenResponse refreshToken(RefreshTokenRequest tokenRefresh) {
		String phoneNumber = jwtUtils.getUsernameFromToken(tokenRefresh.getRefreshToken());
		User user = userRepo.findByPhoneNumber(phoneNumber)
				.orElseThrow(() -> new ErrorException(ErrorCode.PHONE_NOT_FOUND));
		UserDetails userDetails = customUserDetailsService.loadUserByUsername(phoneNumber);
		String refresh_token = refreshTokenService.getToken(REFRESH_TOKEN + user.getId());
		if(refresh_token == null || !jwtUtils.isTokenValid(refresh_token,userDetails)) {
			throw new ErrorException(ErrorCode.INVALID_TOKEN);
		}
		String new_access_token = jwtUtils.generateToken(user);
		return RefreshTokenResponse.builder()
				.token(new_access_token)
				.refreshToken(refresh_token)
				.name(user.getName())
				.phoneNumber(user.getPhoneNumber())
				.build();
	}


	@Override
	public void saveTokenToRedis(User user, String refresh_token) {
		Long expirationTime = jwtUtils.extractExpDate(refresh_token).getTime();
		Long now = System.currentTimeMillis();
		Long ttl = expirationTime - now;
		if (ttl > 0) {
			refreshTokenService.saveToken(REFRESH_TOKEN + user.getId(), refresh_token, ttl);
		}
	}

	@Override
	public void invalidate_token(String refresh_token) {
		Long expirationTime = jwtUtils.extractExpDate(refresh_token).getTime();
		Long now = System.currentTimeMillis();
		Long ttl = expirationTime - now;
		if (ttl > 0) {
			refreshTokenService.saveToken(BLACKLISTED_TOKEN + refresh_token, refresh_token, ttl);
		}
	}
	@Override
	public boolean isTokenBlacklisted(String refresh_token) {
		String key = BLACKLISTED_TOKEN + refresh_token;
		return refreshTokenService.getToken(key) == null;
	}



}
