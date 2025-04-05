package com.Chat.Chat.repository;

import com.Chat.Chat.model.FriendShips;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FriendShipRepo extends MongoRepository<FriendShips, String> {
	Optional<FriendShips> findByUserIdAndFriendId(String userId, String friendId);
}
