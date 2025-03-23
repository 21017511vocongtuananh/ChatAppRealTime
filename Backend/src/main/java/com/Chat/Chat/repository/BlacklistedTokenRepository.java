package com.Chat.Chat.repository;

import com.Chat.Chat.model.BlacklistedToken;
import com.Chat.Chat.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlacklistedTokenRepository extends MongoRepository<BlacklistedToken, String> {
	boolean existsByToken(String token);
//	Optional<User> findByPhoneNumber(String phoneNumber);
}
