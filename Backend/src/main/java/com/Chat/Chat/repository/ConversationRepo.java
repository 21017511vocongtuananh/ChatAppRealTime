package com.Chat.Chat.repository;

import com.Chat.Chat.model.Conversation;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ConversationRepo extends MongoRepository<Conversation, String> {
	@Query("{ 'groupMembers.userId': ?0 }")
	List<Conversation> findByGroupMembersUserIdOrderByLastMessageAtDesc(String userId);

}
