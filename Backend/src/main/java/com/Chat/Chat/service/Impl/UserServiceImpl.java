package com.Chat.Chat.service.Impl;


import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.exception.ErrorCode;
import com.Chat.Chat.exception.ErrorException;
import com.Chat.Chat.mapper.UserMapper;
import com.Chat.Chat.model.User;
import com.Chat.Chat.repository.UserRepo;
import com.Chat.Chat.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepo userRepo;
	private final UserMapper userMapper;


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


//	public User updateUser(String id, User updatedUser) {
//		Optional<User> existingUser = userRepo.findById(id);
//		if (existingUser.isPresent()) {
//			User user = existingUser.get();
//			user.setName(updatedUser.getName());
//			user.setGender(updatedUser.getGender());
//			user.setDateOfBirth(updatedUser.getDateOfBirth());
//			user.setImage(updatedUser.getImage());
//			return userRepo.save(user);
//		} else {
//			throw new RuntimeException("User not found");
//		}
//	}




}
