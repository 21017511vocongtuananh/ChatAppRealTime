package com.Chat.Chat;

import com.Chat.Chat.model.Conversation;
import com.Chat.Chat.model.Message;
import com.Chat.Chat.model.User;
import com.Chat.Chat.repository.ConversationRepo;
import com.Chat.Chat.repository.MessageRepo;
import com.Chat.Chat.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.Collections;

@SpringBootApplication
public class ChatApplication implements CommandLineRunner {

	@Autowired
	private ConversationRepo conversationRepo;

	@Autowired
	private MessageRepo messageRepo;

	@Autowired
	private UserRepo userRepo;

	public static void main(String[] args) {
		SpringApplication.run(ChatApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		if (conversationRepo.count() == 0 && messageRepo.count() == 0 && userRepo.count() == 0) {
			// Thêm dữ liệu User
			User user1 = new User();
			user1.setId("67c086a68c03631f6367499e");
			user1.setName("tuananh3");
			user1.setPhoneNumber("0347804278");
			user1.setEmail("anhchiyeuminhem2k2@gmail.com");
			user1.setPassword("$2a$10$Ao9OOMtka/BQQN567GwNO.q2HWUD4xzSaG1fIWzgnFiEL2JhzSuUe");
			user1.setImage("https://res.cloudinary.com/doypwarq0/image/upload/v1739335351/Screensh…");
			user1.setDateOfBirth(LocalDate.of(2003,04,03));
			user1.setCreatedAt(LocalDateTime.of(2025, 2, 27, 15, 37, 10, 229000000));
			user1.setUpdatedAt(LocalDateTime.of(2025, 2, 27, 15, 37, 10, 229000000));
			user1.setConversationIds(Collections.emptyList());
			user1.setSeenMessageIds(Collections.emptyList());

			User user2 = new User();
			user2.setId("67c0b55afe7b947481a9c68f");
			user2.setName("minhthanh");
			user2.setPhoneNumber("012345678");
			user2.setEmail("huy2222@gmail.com");
			user2.setPassword("$2a$10$Ao9OOMtka/BQQN567GwNO.q2HWUD4xzSaG1fIWzgnFiEL2JhzSuUe");
			user2.setImage("https://res.cloudinary.com/doypwarq0/image/upload/v1739335351/Screensh…");
			user2.setDateOfBirth(LocalDate.of(2003,04,03));
			user2.setCreatedAt(LocalDateTime.of(2025, 2, 27, 15, 37, 10, 229000000));
			user2.setUpdatedAt(LocalDateTime.of(2025, 2, 27, 15, 37, 10, 229000000));
			user2.setConversationIds(Collections.emptyList());
			user2.setSeenMessageIds(Collections.emptyList());

			userRepo.saveAll(Arrays.asList(user1, user2));

			// Thêm dữ liệu Message
			Message message1 = new Message();
			message1.setId("507f191e810c19729de860ec");
			message1.setBody("Xin chào!");
			message1.setImage(null);
			message1.setCreatedAt(LocalDateTime.of(2025, 2, 27, 10, 5));
			message1.setSeenIds(Collections.singletonList("67c086a68c03631f6367499e"));
			message1.setConversationId("507f191e810c19729de860ea");
			message1.setSenderId("67c086a68c03631f6367499e");

			Message message2 = new Message();
			message2.setId("507f191e810c19729de860ed");
			message2.setBody("Chào bạn!");
			message2.setImage(null);
			message2.setCreatedAt(LocalDateTime.of(2025, 2, 27, 10, 10));
			message2.setSeenIds(Arrays.asList("67c086a68c03631f6367499e", "67c0b55afe7b947481a9c68f"));
			message2.setConversationId("67c086a68c03631f6367499e");
			message2.setSenderId("507f1f77bcf86cd799439012");

			Message message3 = new Message();
			message3.setId("507f191e810c19729de860ee");
			message3.setBody(null);
			message3.setImage("https://example.com/images/group-photo.jpg");
			message3.setCreatedAt(LocalDateTime.of(2025, 2, 27, 11, 5));
			message3.setSeenIds(Collections.emptyList());
			message3.setConversationId("507f191e810c19729de860eb");
			message3.setSenderId("507f1f77bcf86cd799439011");

			messageRepo.saveAll(Arrays.asList(message1, message2, message3));

			// Thêm dữ liệu Conversation
			Conversation convo1 = new Conversation();
			convo1.setId("507f191e810c19729de860ea");
			convo1.setName("1 gia dinh");
			convo1.setIsGroup(false);
			convo1.setCreatedAt(LocalDateTime.of(2025, 2, 27, 10, 0));
			convo1.setLastMessageAt(LocalDateTime.of(2025, 2, 27, 10, 10));
			convo1.setMessagesIds(Arrays.asList("507f191e810c19729de860ec", "507f191e810c19729de860ed"));
			convo1.setUsersIds(Arrays.asList("67c086a68c03631f6367499e", "67c0b55afe7b947481a9c68f"));

			Conversation convo2 = new Conversation();
			convo2.setId("507f191e810c19729de860eb");
			convo2.setName("Nhóm bạn bè");
			convo2.setIsGroup(true);
			convo2.setCreatedAt(LocalDateTime.of(2025, 2, 27, 11, 0));
			convo2.setLastMessageAt(LocalDateTime.of(2025, 2, 27, 11, 5));
			convo2.setMessagesIds(Collections.singletonList("507f191e810c19729de860ee"));
			convo2.setUsersIds(Collections.singletonList("67c086a68c03631f6367499e"));

			conversationRepo.saveAll(Arrays.asList(convo1, convo2));

			System.out.println("Initialized sample data for MongoDB");
		}
	}
}