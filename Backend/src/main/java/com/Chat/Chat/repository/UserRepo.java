package com.Chat.Chat.repository;

import com.Chat.Chat.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepo extends MongoRepository<User, String> {
	Optional<User> findByPhoneNumber(String phoneNumber);
	boolean existsByPhoneNumber(String phoneNumber);
}
