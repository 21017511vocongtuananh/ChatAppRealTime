package com.Chat.Chat.repository;

import com.Chat.Chat.model.Message;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepo extends MongoRepository<Message, String> {
	List<Message> findByConversationId(String conversationId, Sort sort);
	List<Message> findAllByIdInAndIsDeletedFalse(List<String> messageIds);

	void deleteByConversationId(String conversationId);
}
