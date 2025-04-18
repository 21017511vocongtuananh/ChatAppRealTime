package com.Chat.Chat.repository;

import com.Chat.Chat.model.Conversation;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepo extends MongoRepository<Conversation, String> {
	@Query("{ 'groupMembers.userId': ?0 }")
	List<Conversation> findByGroupMembersUserIdOrderByLastMessageAtDesc(String userId);

	@Query("{ 'isGroup': false, 'groupMembers.userId': { $all: [?0, ?1] }, 'groupMembers': { $size: 2 } }")
	Optional<Conversation> findPrivateConversationBetween(String userId1, String userId2);

	@Query("{ 'isGroup': true, 'groupMembers.userId': ?0 }")
	List<Conversation> findAllGroupConversationsOfUser(String userId);

	@Query("{ 'isGroup': false, 'groupMembers.userId': ?0 }")
	List<Conversation> findAllNonGroupConversationsOfUser(String userId);


}
