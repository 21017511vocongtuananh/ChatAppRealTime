package com.Chat.Chat.exception;


public class InvalidCredentialsException extends RuntimeException{
	public InvalidCredentialsException(String message){
		super(message);
	}
}