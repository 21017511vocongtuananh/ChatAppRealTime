package com.Chat.Chat.service.Impl;

import com.Chat.Chat.dto.reponse.ConversationResponse;
import com.Chat.Chat.dto.request.ConversationRequest;
import com.Chat.Chat.dto.request.UserRequest;
import com.Chat.Chat.enums.Role;
import com.Chat.Chat.exception.ErrorCode;
import com.Chat.Chat.exception.ErrorException;
import com.Chat.Chat.mapper.ConversationMapper;
import com.Chat.Chat.model.Conversation;
import com.Chat.Chat.model.User;
import com.Chat.Chat.repository.ConversationRepo;
import com.Chat.Chat.service.ConversationService;
import com.Chat.Chat.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ConversationImpl implements ConversationService {
	private final ConversationRepo conversationRepo;
	private final UserService userService;
	private final ConversationMapper conversationMapper;

	@Override
	public ConversationResponse getConversationId(String id) {
		Conversation conversation = conversationRepo.findById(id).orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND,"conversation id not found"));
		ConversationResponse conversationResponse = conversationMapper.toConversationResponseUser(conversation);
		return conversationResponse;
	}

	@Override
	public void deleteConversation(String id) {
		conversationRepo.deleteById(id);
	}

	@Override
	public ConversationResponse createConversation(ConversationRequest conversationRequest) {
		User currentUser = userService.getLoginUser();
		Conversation conversation = new Conversation();
		conversation.setName(conversationRequest.getName());
		conversation.setIsGroup(true);
		List<Conversation.GroupMember> groupMembers = new ArrayList<>();
		groupMembers.add(new Conversation.GroupMember(currentUser.getId(), Role.ADMIN));
		for (UserRequest userRequest : conversationRequest.getUsers()) {
			groupMembers.add(new Conversation.GroupMember(userRequest.getId(), Role.USER));
		}
		conversation.setGroupMembers(groupMembers);
		conversationRepo.save(conversation);
		ConversationResponse conversationResponse = conversationMapper.toConversationResponseUser(conversation);
		return conversationResponse;
	}


	@Override
	public List<ConversationResponse> getConversations() {
		User currentUser = userService.getLoginUser();
		// lay tat ca
		List<ConversationResponse> conversationResponses  = conversationRepo.findByGroupMembersUserIdOrderByLastMessageAtDesc(currentUser.getId())
				.stream()
				.map(conversationMapper::toConversationResponse)
				.collect(Collectors.toList());

		return conversationResponses;
	}
}
