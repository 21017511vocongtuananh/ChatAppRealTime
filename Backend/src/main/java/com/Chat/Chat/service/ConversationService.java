package com.Chat.Chat.service;

import com.Chat.Chat.dto.reponse.ConversationResponse;

import java.util.List;

public interface ConversationService {
//   Response createConversation(ConversationDto conversationDto);
   List<ConversationResponse> getConversations();
   ConversationResponse getConversationId(String id);
   void deleteConversation(String id);
}
