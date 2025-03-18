package com.Chat.Chat.security;

import com.Chat.Chat.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Service
@Slf4j
public class JwtUtils {

	@Value("${jwt.secret}")
	private String secreteJwtString;
	@Value("${jwt.expiration}")
	private long jwtExpiration;
	private SecretKey key;

	@PostConstruct
	private void init(){
		byte[] keyBytes = secreteJwtString.getBytes(StandardCharsets.UTF_8);
		this.key = new SecretKeySpec(keyBytes, "HmacSHA256");
	}
	public String generateToken(User user){
		String userId = user.getId();
		String username = user.getPhoneNumber();
		return generateToken(userId,username);
	}

	public String generateToken(String userId,String username){
		return Jwts.builder()
				.subject(username)
				.claim("id",userId)
				.issuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis() + jwtExpiration))
				.signWith(key)
				.compact();
	}
	public String getUsernameFromToken(String token){
		return extractClaims(token, Claims::getSubject);
	}

	private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction){
		return claimsTFunction.apply(Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload());
	}

	public boolean isTokenValid(String token, UserDetails userDetails){
		final String username = getUsernameFromToken(token);
		return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
	}
	private boolean isTokenExpired(String token)
	{
		return extractClaims(token, Claims::getExpiration).before(new Date());
	}

	public Claims extractAllClaims(String token) {
		return Jwts.parser()
				.verifyWith(key)
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}

}
