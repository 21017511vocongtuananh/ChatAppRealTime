package com.Chat.Chat.service.Impl;

import com.Chat.Chat.dto.request.EmailRequest;
import com.Chat.Chat.exception.ErrorCode;
import com.Chat.Chat.exception.ErrorException;
import com.Chat.Chat.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class MailService {
	private final JavaMailSender mailSender;
	private final UserRepo userRepo;

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
			response.put("otp", otp);
			response.put("action", mode);
			return response;
		} catch (MessagingException e) {
			throw new RuntimeException("Gửi email thất bại", e);
		}
	}

	private String generateOtp() {
		Random random = new Random();
		return String.valueOf(100000 + random.nextInt(900000));
	}
}