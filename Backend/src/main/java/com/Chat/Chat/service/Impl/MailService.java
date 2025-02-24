package com.Chat.Chat.service.Impl;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Random;

@Service
public class MailService {
	private final JavaMailSender mailSender;

	public MailService(JavaMailSender mailSender) {
		this.mailSender = mailSender;
	}

	public String sendOtp(String toEmail) {
		String otp = generateOtp();

		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setTo(toEmail);
			helper.setSubject("Mã OTP của bạn");
			helper.setText("<h3>Mã OTP của bạn là: <b>" + otp + "</b></h3>", true);

			mailSender.send(message);
			return otp;
		} catch (MessagingException e) {
			throw new RuntimeException("Gửi email thất bại", e);
		}
	}

	private String generateOtp() {
		Random random = new Random();
		return String.valueOf(100000 + random.nextInt(900000));
	}
}
