package com.Chat.Chat.repository;

import com.Chat.Chat.enums.FriendshipStatus;
import com.Chat.Chat.model.FriendShips;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendShipRepo extends MongoRepository<FriendShips, String> {
	Optional<FriendShips> findByUserIdAndFriendId(String userId, String friendId);
	List<FriendShips> findByUserId(String userId);
	List<FriendShips> findByFriendIdAndStatus(String friendId, FriendshipStatus status);
}
