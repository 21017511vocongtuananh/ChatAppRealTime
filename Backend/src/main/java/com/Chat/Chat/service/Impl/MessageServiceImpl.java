package com.Chat.Chat.service.Impl;

import com.Chat.Chat.dto.reponse.MessageResponse;
import com.Chat.Chat.dto.request.MessageDto;
import com.Chat.Chat.exception.ErrorCode;
import com.Chat.Chat.exception.ErrorException;
import com.Chat.Chat.mapper.MessageMapper;
import com.Chat.Chat.model.Message;
import com.Chat.Chat.repository.MessageRepo;
import com.Chat.Chat.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

	private final MessageRepo messageRepo;
	private final MessageMapper messageMapper;
	@Override
	public List<MessageResponse> getAllMessage(String conversationId) {
		List<Message> messages = messageRepo.findByConversationId(
				conversationId,
				Sort.by(Sort.Direction.ASC, "createdAt")
		);
		if(messages.isEmpty())
		{
			throw new ErrorException(ErrorCode.NOT_FOUND,"conversationId not found");
		}
		return messages.stream()
				.map(messageMapper::toMessageResponse)
				.collect(Collectors.toList());
	}

//	@Override
//	public Response createMessage(MessageDto messageDto) {
//		return null;
//	}
}
