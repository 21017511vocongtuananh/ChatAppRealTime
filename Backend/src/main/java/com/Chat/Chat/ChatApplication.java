package com.Chat.Chat;

import com.Chat.Chat.enums.Role;
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
			User user1 = new User();
			user1.setId("67c086a68c03631f6367499e");
			user1.setName("Tuan Anh");
			user1.setPhoneNumber("0347804273");
			user1.setEmail("anhchiyeuminhem2k2@gmail.com");
			user1.setGender("Nam");
			user1.setPassword("$2a$10$Ao9OOMtka/BQQN567GwNO.q2HWUD4xzSaG1fIWzgnFiEL2JhzSuUe");
			user1.setImage("https://image-clonezalo.s3.us-east-1.amazonaws.com/z6417652884756_102e9081abb91ccc7e628ef48531bc0f.jpg");
			user1.setDateOfBirth(LocalDate.of(2003, 4, 3));
			user1.setCreatedAt(LocalDateTime.of(2025, 2, 27, 15, 37, 10, 229000000));
			user1.setUpdatedAt(LocalDateTime.of(2025, 2, 27, 15, 37, 10, 229000000));

			User user2 = new User();
			user2.setId("67c0b55afe7b947481a9c68f");
			user2.setName("Thuy Hang");
			user2.setPhoneNumber("0815642343");
			user2.setEmail("thuyhang@gmail.com");
			user2.setGender("Nữ");
			user2.setPassword("$2a$10$Ao9OOMtka/BQQN567GwNO.q2HWUD4xzSaG1fIWzgnFiEL2JhzSuUe");
			user2.setImage("https://image-clonezalo.s3.us-east-1.amazonaws.com/download.jpg");
			user2.setDateOfBirth(LocalDate.of(2003, 4, 3));
			user2.setCreatedAt(LocalDateTime.of(2025, 2, 27, 15, 37, 10, 229000000));
			user2.setUpdatedAt(LocalDateTime.of(2025, 2, 27, 15, 37, 10, 229000000));

			User user3 = new User();
			user3.setId("67c0b55afe7b947481a9c68b");
			user3.setName("Dung");
			user3.setPhoneNumber("0336967664");
			user3.setEmail("dung@gmail.com");
			user3.setGender("Nữ");
			user3.setPassword("$2a$10$Ao9OOMtka/BQQN567GwNO.q2HWUD4xzSaG1fIWzgnFiEL2JhzSuUe");
			user3.setImage("https://image-clonezalo.s3.us-east-1.amazonaws.com/download.jpg");
			user3.setDateOfBirth(LocalDate.of(2003, 4, 3));
			user3.setCreatedAt(LocalDateTime.of(2025, 2, 27, 15, 37, 10, 229000000));
			user3.setUpdatedAt(LocalDateTime.of(2025, 2, 27, 15, 37, 10, 229000000));


			userRepo.saveAll(Arrays.asList(user1, user2, user3));

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
			message2.setConversationId("507f191e810c19729de860ea");
			message2.setSenderId("67c0b55afe7b947481a9c68f");

			Message message3 = new Message();
			message3.setId("507f191e810c19729de860ee");
			message3.setBody("hello");
			message3.setImage(null);
			message3.setCreatedAt(LocalDateTime.of(2025, 2, 27, 11, 5));
			message3.setSeenIds(Collections.singletonList("67c086a68c03631f6367499e"));
			message3.setConversationId("507f191e810c19729de860ea");
			message3.setSenderId("67c086a68c03631f6367499e");

			Message message4 = new Message();
			message4.setId("507f191e810c19729de860eb");
			message4.setBody("hello");
			message4.setImage(null);
			message4.setCreatedAt(LocalDateTime.of(2025, 2, 27, 11, 5));
			message4.setSeenIds(Collections.singletonList("67c0b55afe7b947481a9c68b"));
			message4.setConversationId("507f191e810c19729de860eb");
			message4.setSenderId("67c0b55afe7b947481a9c68b");

			messageRepo.saveAll(Arrays.asList(message1, message2, message3,message4));

			Conversation convo1 = new Conversation();
			convo1.setId("507f191e810c19729de860ea");
			convo1.setName("");
			convo1.setIsGroup(false);
			convo1.setPinnedMessageId("");
			convo1.setCreatedAt(LocalDateTime.of(2025, 2, 27, 10, 0)); // Thời gian tạo
			convo1.setLastMessageAt(LocalDateTime.of(2025, 2, 27, 10, 10)); // Thời gian tin nhắn cuối cùng
			convo1.setMessagesIds(Arrays.asList("507f191e810c19729de860ec", "507f191e810c19729de860ed","507f191e810c19729de860ee"));
			convo1.setGroupMembers(Arrays.asList(
					new Conversation.GroupMember("67c086a68c03631f6367499e", Role.USER,LocalDateTime.now()),
					new Conversation.GroupMember("67c0b55afe7b947481a9c68f", Role.USER,LocalDateTime.now())
			));

			Conversation convo2 = new Conversation();
			convo2.setId("507f191e810c19729de860eb");
			convo2.setName("");
			convo2.setIsGroup(false);
			convo2.setPinnedMessageId("");
			convo2.setCreatedAt(LocalDateTime.of(2025, 2, 27, 10, 0)); // Thời gian tạo
			convo2.setLastMessageAt(LocalDateTime.of(2025, 2, 27, 10, 10)); // Thời gian tin nhắn cuối cùng
			convo2.setMessagesIds(Arrays.asList("507f191e810c19729de860eb"));
			convo2.setGroupMembers(Arrays.asList(
					new Conversation.GroupMember("67c086a68c03631f6367499e", Role.USER,LocalDateTime.now()),
					new Conversation.GroupMember("67c0b55afe7b947481a9c68b", Role.USER,LocalDateTime.now())
			));



			conversationRepo.saveAll(Arrays.asList(convo1,convo2));
			System.out.println("Initialized sample data for MongoDB with 3 users and GroupMember");

		}

	}}