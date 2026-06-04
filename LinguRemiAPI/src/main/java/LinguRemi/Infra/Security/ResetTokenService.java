package LinguRemi.Infra.Security;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;

import LinguRemi.model.Usuarios;

@Service
public class ResetTokenService {
	@Value("${api.security.token.secret}")
	private String secret;
	
	public String generateResetPasswordToken(Usuarios user) {
		try {
			Algorithm alg = Algorithm.HMAC256(secret);
			String token = JWT.create()
					.withIssuer("auth-api")
					.withSubject(user.getEmailUsuarios())
					.withClaim("purpose", "reset-password")
					.withExpiresAt(Instant.now().plus(15,ChronoUnit.MINUTES))
					.sign(alg);
			return token;
		} catch(JWTCreationException e) {
			throw new RuntimeException("Error while generating token", e);
		}
	}
	
	public String validateResetPasswordToken(String token) {
		try {
			Algorithm alg = Algorithm.HMAC256(secret);
			return JWT.require(alg)
					.withIssuer("auth-api")
					.withClaim("purpose", "reset-password")
					.build()
					.verify(token)
					.getSubject();
		} catch(JWTVerificationException e) {
			return null;
		}
	}

}
