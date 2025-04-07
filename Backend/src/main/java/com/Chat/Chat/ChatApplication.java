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
			user1.setName("tuananh3");
			user1.setPhoneNumber("0347804278");
			user1.setEmail("anhchiyeuminhem2k2@gmail.com");
			user1.setGender("male");
			user1.setPassword("$2a$10$Ao9OOMtka/BQQN567GwNO.q2HWUD4xzSaG1fIWzgnFiEL2JhzSuUe");
			user1.setImage("https://res.cloudinary.com/doypwarq0/image/upload/v1732065025/samples/smile.jpg");
			user1.setDateOfBirth(LocalDate.of(2003, 4, 3));
			user1.setCreatedAt(LocalDateTime.of(2025, 2, 27, 15, 37, 10, 229000000));
			user1.setUpdatedAt(LocalDateTime.of(2025, 2, 27, 15, 37, 10, 229000000));
			user1.setConversationIds(Arrays.asList("507f191e810c19729de860ea", "507f191e810c19729de860eb"));
			user1.setSeenMessageIds(Collections.emptyList());

			User user2 = new User();
			user2.setId("67c0b55afe7b947481a9c68f");
			user2.setName("minhthanh");
			user2.setPhoneNumber("012345678");
			user2.setEmail("huy2222@gmail.com");
			user1.setGender("female");
			user2.setPassword("$2a$10$Ao9OOMtka/BQQN567GwNO.q2HWUD4xzSaG1fIWzgnFiEL2JhzSuUe");
			user2.setImage("https://res.cloudinary.com/doypwarq0/image/upload/v1739335351/Screenshot_2025-02-12_114000_eqxpfv.png");
			user2.setDateOfBirth(LocalDate.of(2003, 4, 3));
			user2.setCreatedAt(LocalDateTime.of(2025, 2, 27, 15, 37, 10, 229000000));
			user2.setUpdatedAt(LocalDateTime.of(2025, 2, 27, 15, 37, 10, 229000000));
			user2.setConversationIds(Arrays.asList("507f191e810c19729de860ea", "507f191e810c19729de860eb"));
			user2.setSeenMessageIds(Collections.emptyList());

			User user3 = new User();
			user3.setId("67c0b55afe7b947481a9c690");
			user3.setName("hoanglong");
			user3.setPhoneNumber("0987654321");
			user3.setEmail("long123@gmail.com");
			user3.setGender("male");
			user3.setPassword("$2a$10$Ao9OOMtka/BQQN567GwNO.q2HWUD4xzSaG1fIWzgnFiEL2JhzSuUe");
			user3.setImage("https://res.cloudinary.com/doypwarq0/image/upload/v1732616273/2fcd8ec1-4fa0-4b50-a559-7012234ba504_aothundainu.jpg");
			user3.setDateOfBirth(LocalDate.of(2002, 5, 15));
			user3.setCreatedAt(LocalDateTime.of(2025, 2, 27, 15, 38, 0, 0));
			user3.setUpdatedAt(LocalDateTime.of(2025, 2, 27, 15, 38, 0, 0));
			user3.setConversationIds(Collections.singletonList("507f191e810c19729de860eb"));
			user3.setSeenMessageIds(Collections.emptyList());

			User user4 = new User();
			user4.setId("67c0c789fe7b947481a9c691");
			user4.setName("ngocanh");
			user4.setPhoneNumber("0901234567");
			user4.setEmail("ngocanh2002@gmail.com");
			user4.setGender("female");
			user4.setPassword("$2a$10$Ao9OOMtka/BQQN567GwNO.q2HWUD4xzSaG1fIWzgnFiEL2JhzSuUe");
			user4.setImage("https://res.cloudinary.com/doypwarq0/image/upload/v1732616273/female_avatar_1.jpg");
			user4.setDateOfBirth(LocalDate.of(2002, 9, 10));
			user4.setCreatedAt(LocalDateTime.of(2025, 2, 27, 15, 39, 0, 0));
			user4.setUpdatedAt(LocalDateTime.of(2025, 2, 27, 15, 39, 0, 0));
			user4.setConversationIds(Collections.singletonList("507f191e810c19729de860ea"));
			user4.setSeenMessageIds(Collections.emptyList());

			User user5 = new User();
			user5.setId("67c0c789fe7b947481a9c692");
			user5.setName("khanhduy");
			user5.setPhoneNumber("0912345678");
			user5.setEmail("khanhduy2025@gmail.com");
			user5.setGender("male");
			user5.setPassword("$2a$10$Ao9OOMtka/BQQN567GwNO.q2HWUD4xzSaG1fIWzgnFiEL2JhzSuUe");
			user5.setImage("https://res.cloudinary.com/doypwarq0/image/upload/v1732616273/male_avatar_2.jpg");
			user5.setDateOfBirth(LocalDate.of(2001, 12, 25));
			user5.setCreatedAt(LocalDateTime.of(2025, 2, 27, 15, 40, 0, 0));
			user5.setUpdatedAt(LocalDateTime.of(2025, 2, 27, 15, 40, 0, 0));
			user5.setConversationIds(Arrays.asList("507f191e810c19729de860ea", "507f191e810c19729de860eb"));
			user5.setSeenMessageIds(Collections.emptyList());

			userRepo.saveAll(Arrays.asList(user1, user2, user3,user4,user5));

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
			message3.setBody(null);
			message3.setImage("https://example.com/images/group-photo.jpg");
			message3.setCreatedAt(LocalDateTime.of(2025, 2, 27, 11, 5));
			message3.setSeenIds(Collections.singletonList("67c086a68c03631f6367499e"));
			message3.setConversationId("507f191e810c19729de860eb");
			message3.setSenderId("67c086a68c03631f6367499e");

			messageRepo.saveAll(Arrays.asList(message1, message2, message3));

			// Thêm dữ liệu Conversation với GroupMember
			Conversation convo1 = new Conversation();
			convo1.setId("507f191e810c19729de860ea");
			convo1.setName("1 gia dinh");
			convo1.setIsGroup(false); // Chat 1-1
			convo1.setCreatedAt(LocalDateTime.of(2025, 2, 27, 10, 0)); // Thời gian tạo
			convo1.setLastMessageAt(LocalDateTime.of(2025, 2, 27, 10, 10)); // Thời gian tin nhắn cuối cùng
			convo1.setMessagesIds(Arrays.asList("507f191e810c19729de860ec", "507f191e810c19729de860ed"));
			convo1.setGroupMembers(Arrays.asList(
					new Conversation.GroupMember("67c086a68c03631f6367499e", Role.USER),
					new Conversation.GroupMember("67c0b55afe7b947481a9c68f", Role.USER)
			));

			// Tạo đối tượng Conversation Nhóm bạn bè
			Conversation convo2 = new Conversation();
			convo2.setId("507f191e810c19729de860eb");
			convo2.setName("Nhóm bạn bè");
			convo2.setIsGroup(true); // Nhóm
			convo2.setCreatedAt(LocalDateTime.of(2025, 2, 27, 11, 0)); // Thời gian tạo
			convo2.setLastMessageAt(LocalDateTime.of(2025, 2, 27, 11, 5)); // Thời gian tin nhắn cuối cùng
			convo2.setMessagesIds(Collections.singletonList("507f191e810c19729de860ee"));
			convo2.setGroupMembers(Arrays.asList(
					new Conversation.GroupMember("67c086a68c03631f6367499e", Role.ADMIN), // user1 là ADMIN
					new Conversation.GroupMember("67c0b55afe7b947481a9c68f", Role.USER),  // user2 là USER
					new Conversation.GroupMember("67c0b55afe7b947481a9c690", Role.USER)   // user3 là USER
			));

			conversationRepo.saveAll(Arrays.asList(convo1, convo2));
			System.out.println("Initialized sample data for MongoDB with 3 users and GroupMember");

		}

	}}