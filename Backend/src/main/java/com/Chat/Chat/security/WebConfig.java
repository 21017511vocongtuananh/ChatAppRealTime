package com.Chat.Chat.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/api/**")
						.allowedOrigins("http://localhost:3000") // Cho phép ReactJS gọi API
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Các phương thức được phép
						.allowedHeaders("*") // Cho phép tất cả headers
						.allowCredentials(true); // Cho phép gửi cookie nếu có
			}
		};
	}
}
