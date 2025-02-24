package com.Chat.Chat.service.Impl;


import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.exception.NotFoundException;
import com.Chat.Chat.mapper.UserMapper;
import com.Chat.Chat.model.User;
import com.Chat.Chat.repository.UserRepo;
import com.Chat.Chat.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
		String  phoneNumber = authentication.getName();
		log.info("User phoneNumber is: " + phoneNumber);
		return userRepo.findByPhoneNumber(phoneNumber)
				.orElseThrow(()-> new UsernameNotFoundException("User Not found"));
	}

	@Override
	public List<UserResponse> getAllUser() {
		User loggedInUser = getLoginUser();
		log.info("Logged-in user: " + loggedInUser.getPhoneNumber());
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
				.orElseThrow(() -> new NotFoundException("Phone number not found"));
		UserResponse userResponse = userMapper.toUserResponse(user);
		return userResponse;
	}



}
