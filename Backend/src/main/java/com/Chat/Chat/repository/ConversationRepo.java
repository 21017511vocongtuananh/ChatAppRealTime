package com.Chat.Chat.repository;

import com.Chat.Chat.model.Conversation;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ConversationRepo extends MongoRepository<Conversation, String> {
	List<Conversation> findByUsersIdsContainingOrderByLastMessageAtDesc(String userId);

//	@Aggregation(pipeline = {
//			"{ $match: { 'usersIds': ?0 } }",
//			"{ $lookup: { from: 'users', localField: 'usersIds', foreignField: '_id', as: 'users' } }",
//			"{ $lookup: { from: 'messages', localField: 'messagesIds', foreignField: '_id', as: 'messages' } }",
//			"{ $sort: { 'lastMessageAt': -1 } }"
//	})
//	List<Conversation> findConversationsWithUsersAndMessages(String userId);
}
