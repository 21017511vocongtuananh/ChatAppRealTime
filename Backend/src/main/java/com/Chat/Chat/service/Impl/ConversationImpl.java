package com.Chat.Chat.service.Impl;

import com.Chat.Chat.repository.ConversationRepo;
import com.Chat.Chat.service.ConversationService;
import com.Chat.Chat.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ConversationImpl implements ConversationService {
	private final ConversationRepo conversationRepo;
	private final UserService userService;


//	@Override
//	public Response createConversation(ConversationDto conversationDto) {
//		Conversation conversation = Conversation.builder()
//				.name(conversationDto.getName())
//				.isGroup(conversationDto.getIsGroup())
//				.messages(entityMapper.mapMessageDtoBasic(conversationDto.getMessages()))
//				.build();
//		Conversation conversation1 = conversationRepo.save(conversation);
//		ConversationDto conversationDto1 = entityMapper.mapConversationDtoBasic(conversation1);
//		return Response.builder()
//				.status(200)
//				.message("conversation successfully add")
//				.conversation(conversationDto1)
//				.build();
//	}

//	@Override
//	public Response getConversations() {
//		User currentUser = userService.getLoginUser();
//		if(currentUser == null)
//		{
//			return Response.builder()
//					.status(401)
//					.message("Unauthorized: User not logged in")
//					.build();
//		}
//		List<ConversationDto> conversationsDto  = conversationRepo.findByUsers_IdOrderByLastMessageAtDesc(currentUser.getId())
//				.stream()
//				.map(entityMapper::mapConversationDtoBasic)
//				.collect(Collectors.toList());
//
//		return Response.builder()
//				.status(200)
//				.message("Conversations retrieved successfully")
//				.conversationList(conversationsDto)
//				.build();
//	}
}
