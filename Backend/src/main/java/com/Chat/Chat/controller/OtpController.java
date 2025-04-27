package com.Chat.Chat.controller;

import com.Chat.Chat.dto.request.ApiResource;
import com.Chat.Chat.dto.request.EmailRequest;
import com.Chat.Chat.service.Impl.MailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
		return ApiResource.ok(response, "SUCCESS");
	}

	@PostMapping("/verifyOTP")
	public ApiResource<Map<String, String>> verifyOtp(@RequestParam String Email,@RequestParam String otp){
		boolean verifyOtp = mailService.verifyOtp(Email,otp);
		Map<String,String> data = new HashMap<>();
		data.put("otp",otp);
		data.put("status",verifyOtp ? "OK" : "FAIL");
		return ApiResource.ok(data, "Xác thực OTP thành công");
	}
}
