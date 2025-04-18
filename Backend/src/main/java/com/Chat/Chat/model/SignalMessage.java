package com.Chat.Chat.model;

import lombok.Data;

@Data
public class SignalMessage {
	private String type;
	private String senderId;
	private String receiverId;
	private Object payload;
}
