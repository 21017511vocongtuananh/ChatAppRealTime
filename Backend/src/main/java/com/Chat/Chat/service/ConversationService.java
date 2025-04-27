package com.Chat.Chat.service;

import com.Chat.Chat.dto.reponse.ConversationResponse;
import com.Chat.Chat.dto.reponse.MessageResponse;
import com.Chat.Chat.dto.reponse.UserResponse;
import com.Chat.Chat.dto.request.ConversationRequest;
import com.Chat.Chat.dto.request.UserRequest;
import com.Chat.Chat.model.Conversation;

import java.util.List;

public interface ConversationService {
   List<ConversationResponse> getConversations();
   ConversationResponse getConversationId(String id);
   void deleteConversation(String id);
   ConversationResponse createConversation(ConversationRequest conversationRequest);
   ConversationResponse pinMessage(String conversationId, String messageId);
   MessageResponse getPinnedMessages(String conversationId);
   void deletePinnedMessages(String conversationId);
   List<ConversationResponse> getConversationIsGroupTrue();
   List<ConversationResponse> getConversationIsGroupFalse();
   ConversationResponse addUserToConversation(String conversationId, List<UserRequest> users);
   ConversationResponse removeUserFromConversation(String conversationId, List<UserRequest> users);
   void exitConversation(String conversationId,String newAdminId);
   List<UserResponse> getUsersConversation(String conversationId);
   ConversationResponse changeConversationLeader(String conversationId,String newAdminId);
   void removeMember(String conversationId, String memberIdToRemove);
   void notifyGroupMembers(Conversation conversation);
}
