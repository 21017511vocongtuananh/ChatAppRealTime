package com.Chat.Chat.service.Impl;

import com.Chat.Chat.dto.reponse.ConversationResponse;
import com.Chat.Chat.dto.reponse.MessageResponse;
import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.dto.request.ConversationRequest;
import com.Chat.Chat.dto.request.UserRequest;
import com.Chat.Chat.enums.MessageType;
import com.Chat.Chat.enums.Role;
import com.Chat.Chat.exception.ErrorCode;
import com.Chat.Chat.exception.ErrorException;
import com.Chat.Chat.mapper.ConversationMapper;
import com.Chat.Chat.mapper.MessageMapper;
import com.Chat.Chat.model.Conversation;
import com.Chat.Chat.model.Message;
import com.Chat.Chat.model.User;
import com.Chat.Chat.repository.ConversationRepo;
import com.Chat.Chat.repository.MessageRepo;
import com.Chat.Chat.repository.UserRepo;
import com.Chat.Chat.service.ConversationService;
import com.Chat.Chat.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ConversationImpl implements ConversationService {
	private final ConversationRepo conversationRepo;
	private final UserService userService;
	private final MessageMapper messageMapper;
	private final MessageRepo messageRepo;
	private final ConversationMapper conversationMapper;
	private final SimpMessagingTemplate messagingTemplate;
	private final UserRepo userRepo;

	@Override
	public ConversationResponse getConversationId(String id) {
		Conversation conversation = conversationRepo.findById(id).orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND,"Không tìm thấy Conversation"));
		ConversationResponse conversationResponse = conversationMapper.toConversationResponse(conversation);
		return conversationResponse;
	}

	@Override
	public void deleteConversation(String conversationId) {
		Optional<Conversation> conversationOpt = conversationRepo.findById(conversationId);
		if (conversationOpt.isPresent()) {
			Conversation conversation = conversationOpt.get();
			Map<String, Object> payload = new HashMap<>();
			payload.put("type", "DELETE");
			payload.put("conversationId", conversation.getId());
			for (Conversation.GroupMember member : conversation.getGroupMembers()) {
				messagingTemplate.convertAndSendToUser(
						member.getUserId(),
						"/queue/conversations",
						payload
				);
			}
			messageRepo.deleteByConversationId(conversationId);
			conversationRepo.deleteById(conversationId);
		}
	}


	@Override
	public ConversationResponse createConversation(ConversationRequest conversationRequest) {
		User currentUser = userService.getLoginUser();
		Conversation conversation = new Conversation();
		conversation.setName(conversationRequest.getName());
		conversation.setIsGroup(true);
		List<Conversation.GroupMember> groupMembers = new ArrayList<>();
		groupMembers.add(new Conversation.GroupMember(currentUser.getId(), Role.ADMIN,LocalDateTime.now()));
		for (UserRequest userRequest : conversationRequest.getUsers()) {
			groupMembers.add(new Conversation.GroupMember(userRequest.getId(), Role.USER,LocalDateTime.now()));
		}
		conversation.setGroupMembers(groupMembers);
		conversationRepo.save(conversation);
		ConversationResponse conversationResponse = conversationMapper.toConversationResponse(conversation);
		notifyGroupMembers(conversation);
		return conversationResponse;
	}

	@Override
	public ConversationResponse pinMessage(String conversationId, String messageId) {
		Conversation conversation = conversationRepo.findById(conversationId).orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND,"không tìm thấy cuộc trò chuyện"));
		conversation.setPinnedMessageId(messageId);
		conversationRepo.save(conversation);
		ConversationResponse conversationResponse = conversationMapper.toConversationResponse(conversation);
		messagingTemplate.convertAndSend(
				"/topic/conversation/" + conversationId,
				conversationResponse
		);
		return conversationResponse;
	}

	@Override
	public MessageResponse getPinnedMessages(String conversationId) {
		Conversation conversation = conversationRepo.findById(conversationId)
				.orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy cuộc trò chuyện"));

		String pinnedMessageId = conversation.getPinnedMessageId();
		if (pinnedMessageId.isEmpty()) {
			throw new ErrorException(ErrorCode.NOT_FOUND, "Chưa có tin nhắn nào được ghim");
		}
		Message pinnedMessage = messageRepo.findById(pinnedMessageId)
				.orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy tin nhắn đã ghim"));
		return messageMapper.toMessageResponse(pinnedMessage);
	}


	@Override
	public void deletePinnedMessages(String conversationId) {
		Conversation conversation = conversationRepo.findById(conversationId)
				.orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy cuộc trò chuyện"));
		conversation.setPinnedMessageId("");
		conversationRepo.save(conversation);
		ConversationResponse conversationResponse = conversationMapper.toConversationResponse(conversation);
				messagingTemplate.convertAndSend(
				"/topic/conversation/" + conversationId,
				conversationResponse
		);
	}

	@Override
	public List<ConversationResponse> getConversationIsGroupTrue() {
		User currentUser = userService.getLoginUser();
		List<ConversationResponse> conversationResponses = conversationRepo.findAllGroupConversationsOfUser(currentUser.getId())
				.stream()
				.map(conversationMapper::toConversationResponse)
				.collect(Collectors.toList());
		return conversationResponses;
	}

	@Override
	public List<ConversationResponse> getConversationIsGroupFalse() {
		User currentUser = userService.getLoginUser();
		List<ConversationResponse> conversationResponses  = conversationRepo.findAllNonGroupConversationsOfUser(currentUser.getId())
				.stream()
				.map(conversationMapper::toConversationResponse)
				.collect(Collectors.toList());
		return conversationResponses;
	}

	@Override
	public ConversationResponse addUserToConversation(String conversationId, List<UserRequest> userIds) {
		Conversation conversation = conversationRepo.findById(conversationId)
				.orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy cuộc trò chuyện"));

		List<Conversation.GroupMember> currentMembers = conversation.getGroupMembers();
		Set<String> existingMemberIds = currentMembers.stream()
				.map(Conversation.GroupMember::getUserId)
				.collect(Collectors.toSet());

		List<String> newUserNames = new ArrayList<>();
		for (UserRequest userRequest : userIds) {
			String userId = userRequest.getId();
			if (!existingMemberIds.contains(userId)) {
				User user = userRepo.findById(userId)
						.orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy người dùng"));
				currentMembers.add(new Conversation.GroupMember(userId, Role.USER, LocalDateTime.now()));
				existingMemberIds.add(userId);
				newUserNames.add(user.getName());
			}
		}
		Message message = new Message();
		message.setBody(String.join(", ", newUserNames) + " đã được thêm vào nhóm");
		message.setSenderId(null);
		message.setDeleted(false);
		message.setSeenIds(null);
		message.setConversationId(conversationId);
		message.setCreatedAt(LocalDateTime.now());
		message.setMessageType(MessageType.SYSTEM);
		Message savedMessage = messageRepo.save(message);
		List<String> messageIds = conversation.getMessagesIds();
		messageIds.add(savedMessage.getId());
		conversation.setMessagesIds(messageIds);
		conversation.setGroupMembers(currentMembers);
		conversationRepo.save(conversation);
		messagingTemplate.convertAndSend(
				"/topic/conversation/" + conversationId,
				savedMessage
		);
		notifyGroupMembers(conversation);
		return conversationMapper.toConversationResponse(conversation);
	}


	@Override
	public ConversationResponse removeUserFromConversation(String conversationId, List<UserRequest> users) {
//		Conversation conversation = conversationRepo.findById(conversationId)
//				.orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy cuộc trò chuyện"));
//		List<Conversation.GroupMember> currentMembers = conversation.getGroupMembers();
//		currentMembers
		return null;
	}



	@Override
	public void exitConversation(String conversationId, String newAdminId) {
		User currentUser = userService.getLoginUser();
		Conversation conversation = conversationRepo.findById(conversationId)
				.orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy cuộc trò chuyện"));
		if (!conversation.getIsGroup()) {
			throw new ErrorException(ErrorCode.BAD_REQUEST, "Không thể rời khỏi cuộc trò chuyện cá nhân");
		}
		boolean isAdmin = conversation.getGroupMembers().stream()
				.anyMatch(member -> member.getUserId().equals(currentUser.getId()) && member.getRole() == Role.ADMIN);
		if (isAdmin) {
			if (newAdminId == null || newAdminId.isBlank()) {
				throw new ErrorException(ErrorCode.BAD_REQUEST, "Phải chọn admin mới");
			}
			boolean isValidNewAdmin = conversation.getGroupMembers().stream()
					.anyMatch(member -> member.getUserId().equals(newAdminId) && !member.getUserId().equals(currentUser.getId()));
			if (!isValidNewAdmin) {
				throw new ErrorException(ErrorCode.BAD_REQUEST, "Người được chọn không hợp lệ");
			}
			conversation.getGroupMembers().forEach(member -> {
				if (member.getUserId().equals(newAdminId)) {
					member.setRole(Role.ADMIN);
				}
			});
		}
		conversation.getGroupMembers().removeIf(member -> member.getUserId().equals(currentUser.getId()));
		Message message = new Message();
		message.setBody(currentUser.getName() + " " + "đã rời nhóm");
		message.setSenderId(null);
		message.setDeleted(false);
		message.setSeenIds(null);
		message.setConversationId(conversationId);
		message.setCreatedAt(LocalDateTime.now());
		message.setMessageType(MessageType.SYSTEM);
		Message savedMessage = messageRepo.save(message);
		List<String> messageIds = new ArrayList<>(conversation.getMessagesIds());
		messageIds.add(savedMessage.getId());
		conversation.setMessagesIds(messageIds);
		if (conversation.getGroupMembers().size() <= 1) {
			conversationRepo.delete(conversation);
		} else {
			conversationRepo.save(conversation);
		}
		notifyGroupMembers(conversation);
		messagingTemplate.convertAndSend(
				"/topic/conversation/" + conversationId,
				message
		);
	}

	@Override
	public List<UserResponse> getUsersConversation(String conversationId) {
		User currentUser = userService.getLoginUser();
		Conversation conversation = conversationRepo.findById(conversationId)
				.orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy cuộc trò chuyện"));
		List<UserResponse> users = new ArrayList<>();
		for (Conversation.GroupMember member : conversation.getGroupMembers()) {
			if (!member.getUserId().equals(currentUser.getId())) {
				User user = userRepo.findById(member.getUserId())
						.orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy người dùng"));
				users.add(UserResponse.builder()
						.id(user.getId())
						.name(user.getName())
						.phoneNumber(user.getPhoneNumber())
								.image(user.getImage())
						.build());
			}
		}
		return users;
	}

	@Override
	public ConversationResponse changeConversationLeader(String conversationId, String newAdminId) {
		User currentUser = userService.getLoginUser();
		Conversation conversation = conversationRepo.findById(conversationId)
				.orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy cuộc trò chuyện"));
		boolean isAdmin = conversation.getGroupMembers().stream()
				.anyMatch(member -> member.getUserId().equals(currentUser.getId()) && member.getRole() == Role.ADMIN);
		if (!isAdmin) {
			throw new ErrorException(ErrorCode.FORBIDDEN, "Chỉ trưởng nhóm mới có thể chuyển quyền");
		}
		boolean isValidNewAdmin = conversation.getGroupMembers().stream()
				.anyMatch(member -> member.getUserId().equals(newAdminId) && !member.getUserId().equals(currentUser.getId()));
		if (!isValidNewAdmin) {
			throw new ErrorException(ErrorCode.BAD_REQUEST, "Người được chọn không hợp lệ hoặc không có trong nhóm");
		}

		conversation.getGroupMembers().forEach(member -> {
			if (member.getUserId().equals(newAdminId)) {
				member.setRole(Role.ADMIN);
			}
			if (member.getUserId().equals(currentUser.getId())) {
				member.setRole(Role.USER);
			}
		});
		conversationRepo.save(conversation);
		notifyGroupMembers(conversation);
		return conversationMapper.toConversationResponse(conversation);
	}

	@Override
	public void removeMember(String conversationId, String memberIdToRemove) {
		User currentUser = userService.getLoginUser();
		Conversation conversation = conversationRepo.findById(conversationId)
				.orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND, "Không tìm thấy cuộc trò chuyện"));
		if (!conversation.getIsGroup()) {
			throw new ErrorException(ErrorCode.BAD_REQUEST, "Không thể xóa thành viên khỏi cuộc trò chuyện cá nhân");
		}
		boolean isAdmin = conversation.getGroupMembers().stream()
				.anyMatch(member -> member.getUserId().equals(currentUser.getId()) && member.getRole() == Role.ADMIN);

		if (!isAdmin) {
			throw new ErrorException(ErrorCode.FORBIDDEN, "Chỉ trưởng nhóm mới có thể xóa thành viên");
		}
		boolean memberExists = conversation.getGroupMembers().stream()
				.anyMatch(member -> member.getUserId().equals(memberIdToRemove));
		if (!memberExists) {
			throw new ErrorException(ErrorCode.NOT_FOUND, "Thành viên không tồn tại trong nhóm");
		}
		if (memberIdToRemove.equals(currentUser.getId())) {
			throw new ErrorException(ErrorCode.BAD_REQUEST, "Bạn không thể tự xóa chính mình. Hãy dùng chức năng rời nhóm");
		}
		conversation.getGroupMembers().removeIf(member -> member.getUserId().equals(memberIdToRemove));
		if (conversation.getGroupMembers().size() < 2) {
			conversationRepo.delete(conversation);
		} else {
			conversationRepo.save(conversation);
		}
		notifyGroupMembers(conversation);
	}

	@Override
	public void notifyGroupMembers(Conversation conversation) {
		List<Conversation.GroupMember> members = conversation.getGroupMembers();
		ConversationResponse notification = conversationMapper.toConversationResponse(conversation);
		for (Conversation.GroupMember member : members) {
			String userId = member.getUserId();
				messagingTemplate.convertAndSendToUser(
						userId,
						"/queue/conversations",
						notification
				);
		}
	}


	@Override
	public List<ConversationResponse> getConversations() {
		User currentUser = userService.getLoginUser();
		List<ConversationResponse> conversationResponses  = conversationRepo.findByGroupMembersUserIdOrderByLastMessageAtDesc(currentUser.getId())
				.stream()
				.map(conversationMapper::toConversationResponse)
				.collect(Collectors.toList());
		return conversationResponses;
	}
}
