package com.Chat.Chat.repository;

import com.Chat.Chat.model.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ConversationRepo extends MongoRepository<Conversation, String> {
	List<Conversation> findByUsers_IdOrderByLastMessageAtDesc(String userId);
}
