package com.Chat.Chat.repository;

import com.Chat.Chat.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepo extends MongoRepository<User, String> {
	@Query("{ 'name': { $regex: ?0, $options: 'i' } }")
	List<User> searchByName(String keyword);
	Optional<User> findByPhoneNumber(String phoneNumber);
	Optional<User> findByEmail(String email);
	boolean existsByPhoneNumber(String phoneNumber);
	boolean existsByEmail(String email);
}
