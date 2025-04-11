package com.Chat.Chat.service;

import com.Chat.Chat.dto.reponse.ConversationResponse;
import com.Chat.Chat.dto.reponse.MessageResponse;
import com.Chat.Chat.dto.request.ConversationRequest;

import java.util.List;

public interface ConversationService {
   List<ConversationResponse> getConversations();
   ConversationResponse getConversationId(String id);
   void deleteConversation(String id);
   ConversationResponse createConversation(ConversationRequest conversationRequest);
   ConversationResponse pinMessage(String conversationId, String messageId);
   MessageResponse getPinnedMessages(String conversationId);
   void deletePinnedMessages(String conversationId);
}
