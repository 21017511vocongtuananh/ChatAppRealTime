package com.Chat.Chat.security;

import com.Chat.Chat.dto.request.ErrorResource;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

	private final JwtUtils jwtUtils;
	private final CustomUserDetailsService customUserDetailsService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
			String token = getTokenFromRequest(request);
			if (jwtUtils.isBlacklistToken(token)) {
				sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Xác thực không thành công", "Token đã bị vô hiệu hóa.");
				return;
			}
			if (jwtUtils.isTokenExpired(token)) {
				sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Xác thực không thành công", "Token đã bị hết hạn.");
				return;
			}
			if (token != null) {
				String username = jwtUtils.getUsernameFromToken(token);
				UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
				if (StringUtils.hasText(username) && jwtUtils.isTokenValid(token, userDetails)) {
					UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
							userDetails, null, userDetails.getAuthorities()
					);
					authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(authenticationToken);
				}
			}

		filterChain.doFilter(request,response);
	}

	private String getTokenFromRequest(HttpServletRequest request)
	{
		String token = request.getHeader("Authorization");
		if(StringUtils.hasText(token) && StringUtils.startsWithIgnoreCase(token,"Bearer ")){
			return token.substring(7);
		}
		return null;
	}
	private void sendErrorResponse(HttpServletResponse response, int status, String error, String message) throws IOException {
		response.setStatus(status);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(String.format("{\"error\": \"%s\", \"message\": \"%s\"}", error, message));
	}

}
