package com.Chat.Chat.security;

import com.Chat.Chat.model.User;
import com.Chat.Chat.repository.BlacklistedTokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class JwtUtils {

	@Value("${jwt.secret}")
	private String secreteJwtString;
	@Value("${jwt.expiration}")
	private long jwtExpiration;
	@Value("${jwt.expirationRefreshToken}")
	private long getJwtExpirationRefreshToken;
	private SecretKey key;
	private final BlacklistedTokenRepository blacklistedTokenRepository;

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
				.issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis() + jwtExpiration * 1000))
				.signWith(key)
				.compact();
	}

	public String generateRefreshToken(User user){
		String userId = user.getId();
		String username = user.getPhoneNumber();
		return generateRefreshToken(userId,username);
	}
	public String generateRefreshToken(String userId,String username){
		Date now = new Date();
		Date expiryDate = new Date(now.getTime() + getJwtExpirationRefreshToken);
		return Jwts.builder()
				.subject(username)
				.claim("id",userId)
				.issuedAt(new Date(System.currentTimeMillis()))
				.expiration(expiryDate)
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
	public boolean isTokenExpired(String token)
	{
		try {
			Claims claims = extractAllClaims(token);
			if(claims != null){
				return claims.getExpiration().before(new Date());
			}else {
				return true;
			}
		}catch (Exception e){
			return false;
		}
	}

	public Claims extractAllClaims(String token) {
		try {
			return Jwts.parser()
					.verifyWith(key)
					.build()
					.parseSignedClaims(token)
					.getPayload();
		}catch (ExpiredJwtException e){
			return null;
		}
	}

	public boolean isBlacklistToken (String token){
		return blacklistedTokenRepository.existsByToken(token);
	}
	public Date extractExpDate(String token){
		return extractAllClaims(token).getExpiration();
	}

//	public boolean isRefreshTokenValid(String token){
//		try {
//			Jwts.parser()
//					.verifyWith(key)
//					.build()
//					.parseSignedClaims(token)
//					.getPayload();
//			RefreshToken refreshToken = refreshTokenRepository.findByRefreshToken(token).orElseThrow(() -> new ErrorException(ErrorCode.NOT_FOUND,"Not found RefreshToken"));
//			final Date expiration = extractClaims(refreshToken.getRefreshToken(),Claims::getExpiration);
//			return expiration.after(new Date());
//		}catch (Exception e){
//			return false;
//		}
//	}
}
