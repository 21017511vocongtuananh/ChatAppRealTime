package com.Chat.Chat.config;

import com.Chat.Chat.exception.ErrorCode;
import com.Chat.Chat.exception.ErrorException;
import com.Chat.Chat.model.User;
import com.Chat.Chat.repository.UserRepo;
import com.Chat.Chat.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
	private final JwtUtils jwtUtils;
	private final UserRepo userRepo;
	private final RedisTemplate<String, Object> redisTemplate;

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		config.enableSimpleBroker("/topic", "/user");
		config.setUserDestinationPrefix("/user");
		config.setApplicationDestinationPrefixes("/app");
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/ws")
				.setAllowedOrigins("https://nhom10iuh.id.vn","http://localhost:8081","http://localhost:3000")
				.withSockJS();
	}

	@Override
	public void configureWebSocketTransport(WebSocketTransportRegistration registry) {
		registry.setMessageSizeLimit(128 * 1024 * 1024);
		registry.setSendBufferSizeLimit(128 * 1024 * 1024);
		registry.setSendTimeLimit(60 * 1000);
		WebSocketMessageBrokerConfigurer.super.configureWebSocketTransport(registry);
	}

	@Override
	public void configureClientInboundChannel(ChannelRegistration registration) {
		registration.interceptors(new ChannelInterceptor() {
			@Override
			public Message<?> preSend(Message<?> message, MessageChannel channel) {
				StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
				if (StompCommand.CONNECT.equals(accessor.getCommand())) {
					String authHeader = accessor.getFirstNativeHeader("Authorization");
					if (authHeader != null && authHeader.startsWith("Bearer ")) {
						String token = authHeader.substring(7);
						try {
							String username = jwtUtils.getUsernameFromToken(token);
							User user = userRepo.findByPhoneNumber(username)
									.orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND));

							// Lưu user vào session
							accessor.getSessionAttributes().put("CURRENT_USER", user);

							// Lưu trạng thái Online vào Redis
							redisTemplate.opsForValue().set("ONLINE_USER:" + user.getId(), "ONLINE");
							log.info("User {} is now ONLINE", username);

						} catch (Exception e) {
							throw new IllegalArgumentException("Token processing failed: " + e.getMessage());
						}
					} else {
						throw new IllegalArgumentException("Missing Authorization header!");
					}
				}
				return message;
			}
		});
	}
}


