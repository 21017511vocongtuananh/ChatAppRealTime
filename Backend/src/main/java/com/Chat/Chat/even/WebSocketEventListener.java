//package com.Chat.Chat.even;
//
//import com.Chat.Chat.model.User;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.context.event.EventListener;
//import org.springframework.data.redis.core.StringRedisTemplate;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.messaging.SessionConnectedEvent;
//import org.springframework.web.socket.messaging.SessionDisconnectEvent;
//
//import java.util.Set;
//
//@Component
//@RequiredArgsConstructor
//@Slf4j
//public class WebSocketEventListener {
//	private final StringRedisTemplate redisTemplate;
//	private final SimpMessagingTemplate messagingTemplate;
//	private static final String ONLINE_USERS_KEY = "online_users";
//
//	@EventListener
//	public void handleWebSocketConnectListener(SessionConnectedEvent event) {
//		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
//		User user = (User) accessor.getSessionAttributes().get("CURRENT_USER");
//
//		if (user != null) {
//			redisTemplate.opsForSet().add(ONLINE_USERS_KEY, user.getPhoneNumber());
//			log.info("User {} connected and set as ONLINE", user.getPhoneNumber());
//			sendOnlineUsers();
//		} else {
//			log.warn("No user found in session attributes during connect");
//		}
//	}
//
//	@EventListener
//	public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
//		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
//		User user = (User) accessor.getSessionAttributes().get("CURRENT_USER");
//
//		if (user != null) {
//			redisTemplate.opsForSet().remove(ONLINE_USERS_KEY, user.getPhoneNumber());
//			log.info("User {} disconnected and set as OFFLINE", user.getPhoneNumber());
//			sendOnlineUsers();
//		}
//	}
//
//	private void sendOnlineUsers() {
//		Set<String> onlineUsers = redisTemplate.opsForSet().members(ONLINE_USERS_KEY);
//		if (onlineUsers == null) {
//			onlineUsers = Set.of();
//		}
//		messagingTemplate.convertAndSend("/topic/online-users", onlineUsers);
//	}
//}