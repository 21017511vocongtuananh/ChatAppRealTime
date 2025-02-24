package com.Chat.Chat.controller;

import com.Chat.Chat.dto.request.ApiResource;
import com.Chat.Chat.service.Impl.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/otp")
@RequiredArgsConstructor
public class OtpController {
	private final MailService mailService;

	@PostMapping("/send")
	public ApiResource<String> sendOtp(@RequestParam String email) {
		return ApiResource.ok(mailService.sendOtp(email),"Gữi OTP thành công");
	}
}
