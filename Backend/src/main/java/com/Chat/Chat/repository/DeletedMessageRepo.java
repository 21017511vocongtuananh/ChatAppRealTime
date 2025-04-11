package com.Chat.Chat.repository;

import com.Chat.Chat.model.DeletedMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DeletedMessageRepo extends MongoRepository<DeletedMessage, String> {
	boolean existsByMessageIdAndDeletedBy(String messageId, String deletedBy);
	List<DeletedMessage> findByDeletedBy(String deletedBy);
}
