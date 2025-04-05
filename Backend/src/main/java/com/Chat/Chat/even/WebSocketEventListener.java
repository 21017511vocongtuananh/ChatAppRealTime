package com.Chat.Chat.even;

import com.Chat.Chat.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

	private final RedisTemplate<String, Object> redisTemplate;

	@EventListener
	public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
		User user = (User) accessor.getSessionAttributes().get("CURRENT_USER");

		if (user != null) {
			redisTemplate.delete("ONLINE_USER:" + user.getId());
			log.info("🔌 User {} đã offline", user.getPhoneNumber());
		}
	}
}

