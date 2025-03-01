package com.Chat.Chat.controller;

import com.Chat.Chat.dto.request.ApiResource;
import com.Chat.Chat.dto.request.EmailRequest;
import com.Chat.Chat.service.Impl.MailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/otp")
@RequiredArgsConstructor
public class OtpController {
	private final MailService mailService;

	@PostMapping("/send")
	public ApiResource<Map<String, String>> sendOtp(
			@Valid @RequestBody EmailRequest request,
			@RequestParam("mode") String mode) {
		Map<String, String> response = mailService.sendOtp(request, mode);
		return ApiResource.ok(response, "Gửi OTP thành công");
	}
}
