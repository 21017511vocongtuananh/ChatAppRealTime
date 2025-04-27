package com.Chat.Chat.service.Impl;

import com.Chat.Chat.dto.request.EmailRequest;
import com.Chat.Chat.exception.ErrorCode;
import com.Chat.Chat.exception.ErrorException;
import com.Chat.Chat.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class MailService {
	private final JavaMailSender mailSender;
	private final UserRepo userRepo;
	private final RedisTemplate<String, String> redisTemplate;

	public Map<String, String> sendOtp(EmailRequest request, String mode) {
		Map<String, String> response = new HashMap<>();
		String email = request.getEmail();
		boolean emailExists = userRepo.existsByEmail(email);

		if ("reset".equals(mode)) {
			if (!emailExists) {
				throw new ErrorException(ErrorCode.NOT_FOUND, "Email không tồn tại trong hệ thống");
			}
		} else if ("register".equals(mode)) {
			if (emailExists) {
				throw new ErrorException(ErrorCode.EMAIL_ALREADY_EXISTS, "Email đã tồn tại trong hệ thống");
			}
		}
		String otp = generateOtp();
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
			helper.setTo(email);
			helper.setSubject("Mã OTP của bạn");
			helper.setText("<h3>Mã OTP của bạn là: <b>" + otp + "</b></h3>", true);
			mailSender.send(message);
			redisTemplate.opsForValue().set("OTP" + email, otp, 60, TimeUnit.SECONDS);
			response.put("message", "Gửi OTP thành công");
			return response;
		} catch (MessagingException e) {
			throw new RuntimeException("Gửi email thất bại", e);
		}
	}

	private String generateOtp() {
		Random random = new Random();
		return String.valueOf(100000 + random.nextInt(900000));
	}

	public boolean verifyOtp(String email, String Otp){
		String key = "OTP" + email;
		String storedOtp = redisTemplate.opsForValue().get(key);
		if(storedOtp == null){
			throw new ErrorException(ErrorCode.EXPIRED);
		}
		if(!storedOtp.equals(Otp)){
			throw new ErrorException(ErrorCode.INVALID);
		}
		redisTemplate.delete(key);
		return true;
	}
}