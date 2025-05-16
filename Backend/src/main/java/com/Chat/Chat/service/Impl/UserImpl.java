package com.Chat.Chat.service.Impl;


import com.Chat.Chat.dto.reponse.FriendShipResponse;
import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.dto.request.UpdatePassword;
import com.Chat.Chat.dto.request.UpdateUserRequest;
import com.Chat.Chat.dto.request.UserRequest;
import com.Chat.Chat.exception.ErrorCode;
import com.Chat.Chat.exception.ErrorException;
import com.Chat.Chat.mapper.UserMapper;
import com.Chat.Chat.model.User;
import com.Chat.Chat.repository.UserRepo;
import com.Chat.Chat.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserImpl implements UserService {

	private final UserRepo userRepo;
	private final UserMapper userMapper;
	private final S3Service s3Service;
	private final RedisTemplate<String, Object> redisTemplate;
	private final PasswordEncoder passwordEncoder;


	@Override
	public User getLoginUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated() ||
				authentication instanceof AnonymousAuthenticationToken) {
			throw new ErrorException(ErrorCode.UNAUTHORIZED, "Unauthorized: User not logged in");
		}
		String phoneNumber = authentication.getName();
		return userRepo.findByPhoneNumber(phoneNumber)
				.orElseThrow(() -> new ErrorException(ErrorCode.USER_NOT_FOUND, "User not found"));
	}


	@Override
	public List<UserResponse> getAllUser() {
		User loggedInUser = getLoginUser();
		List<UserResponse> userResponses = userRepo.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
				.stream()
				.filter(user -> !user.getPhoneNumber().equals(loggedInUser.getPhoneNumber())) // Loại bỏ user login
				.map(userMapper::toUserResponse)
				.collect(Collectors.toList());
		return userResponses;

	}

	@Override
	public UserResponse getByPhoneNumBer() {
		User loggedInUser = getLoginUser();
		User user = userRepo.findByPhoneNumber(loggedInUser.getPhoneNumber())
				.orElseThrow(() -> new ErrorException(ErrorCode.PHONE_NOT_FOUND));
		UserResponse userResponse = userMapper.toUserResponse(user);
		return userResponse;
	}

	@Override
	public List<UserResponse> getOnlineUsers() {
		Set<String> onlineUserKeys = redisTemplate.keys("ONLINE_USER:*");
		if (onlineUserKeys == null || onlineUserKeys.isEmpty()) {
			return Collections.emptyList();
		}
		List<String> userIds = onlineUserKeys.stream()
				.map(key -> key.replace("ONLINE_USER:", ""))
				.collect(Collectors.toList());
		return userRepo.findAllById(userIds).stream()
				.map(userMapper::toUserResponse)
				.collect(Collectors.toList());
	}

	@Override
	public UserResponse getPhoneUserFriend(String phoneNumber) {
		User user = userRepo.findByPhoneNumber(phoneNumber).orElseThrow(() -> new ErrorException(ErrorCode.PHONE_NOT_FOUND));
		return userMapper.toUserResponse(user);
	}

	@Override
	public UserResponse updateUser(String userId, MultipartFile imageFile, UpdateUserRequest userRequest) {
		User user = userRepo.findById(userId).orElseThrow(() -> new ErrorException(ErrorCode.USER_NOT_FOUND));
		user.setName(userRequest.getName());
		if(imageFile != null) {
			String imageUrl = s3Service.saveImageToS3(imageFile);
			user.setImage(imageUrl);
		}
		user.setGender(userRequest.getGender());
		user.setDateOfBirth(userRequest.getDateOfBirth());
		userRepo.save(user);
		return userMapper.toUserResponse(user);
	}

	@Override
	public UserResponse updatePassword(String userId, UpdatePassword newPassword) {
		User user = getLoginUser();
		if (!passwordEncoder.matches(newPassword.getCurrentPassword(), user.getPassword())) {
			throw new ErrorException(ErrorCode.INVALID_PASSWORD);
		}
		if (!newPassword.getNewPassword().equals(newPassword.getConfirmNewPassword())) {
			throw new ErrorException(ErrorCode.INVALID_PASSWORD, "Mật khẩu mới không trùng nhau");
		}
		user.setPassword(passwordEncoder.encode(newPassword.getNewPassword()));
		userRepo.save(user);
		return userMapper.toUserResponse(user);
	}




}
