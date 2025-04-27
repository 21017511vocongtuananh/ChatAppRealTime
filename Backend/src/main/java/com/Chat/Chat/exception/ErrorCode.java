package com.Chat.Chat.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
	UNAUTHORIZED(401, "Người dùng chưa được xác thực", HttpStatus.UNAUTHORIZED),
	PHONE_NOT_FOUND(404, "Không tìm thấy số điện thoại", HttpStatus.NOT_FOUND),
	USER_NOT_FOUND(404, "Không tìm thấy người dùng", HttpStatus.NOT_FOUND),
	NOT_FOUND(404, "Không tìm thấy", HttpStatus.NOT_FOUND),
	PHONE_NUMBER_ALREADY_EXISTS(400, "Số điện thoại đã tồn tại", HttpStatus.BAD_REQUEST),
	EMAIL_ALREADY_EXISTS(409, "Email đã tồn tại", HttpStatus.CONFLICT),
	BAD_REQUEST(400, "Số điện thoại hoặc mật khẩu không hợp lệ", HttpStatus.BAD_REQUEST),
	INTERNAL_SERVER_ERROR(500, "Đã xảy ra lỗi phía máy chủ", HttpStatus.INTERNAL_SERVER_ERROR),
	VALIDATION_ERROR(422, "Dữ liệu không hợp lệ", HttpStatus.UNPROCESSABLE_ENTITY),
	UNCATEGORIZED_EXCEPTION(9999, "Lỗi không xác định", HttpStatus.INTERNAL_SERVER_ERROR),
	INVALID_CREDENTIALS(401, "Thông tin đăng nhập không chính xác", HttpStatus.BAD_REQUEST),
	ALREADY_EXISTS(409, "Dữ liệu đã tồn tại", HttpStatus.CONFLICT),
	INVALID_TOKEN(401, "Token không hợp lệ hoặc đã hết hạn", HttpStatus.UNAUTHORIZED),
	INVALID_PASSWORD(401, "Mật khẩu hiện tại không đúng", HttpStatus.UNAUTHORIZED),
	FORBIDDEN(403,"Không có quyền truy cập",HttpStatus.FORBIDDEN),
	EXPIRED(410, "Mã OTP đã hết hạn hoặc không tồn tại", HttpStatus.GONE),
	INVALID(401, "Mã OTP không đúng", HttpStatus.UNAUTHORIZED);



	private final int code;
	private final String defaultMessage;
	private final HttpStatus status;

	ErrorCode(int code, String defaultMessage, HttpStatus status) {
		this.code = code;
		this.defaultMessage = defaultMessage;
		this.status = status;
	}
}