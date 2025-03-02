package com.Chat.Chat.model;

import com.Chat.Chat.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GroupMember {
	private String userId;
	private Role role;
}
