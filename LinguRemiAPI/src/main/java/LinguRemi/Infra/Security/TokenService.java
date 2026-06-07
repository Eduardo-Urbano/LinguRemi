package LinguRemi.Infra.Security;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import LinguRemi.model.Usuarios;

@Service
public class TokenService {
	@Value("${api.security.token.secret}")
	private String secret;
	private static final Logger logger =
			LoggerFactory.getLogger(TokenService.class);
	
	public String generateToken(Usuarios user) {
		try {
			Algorithm alg = Algorithm.HMAC256(secret);
			String token = JWT.create()
					.withIssuer("auth-api")
					.withSubject(user.getEmailUsuarios())
					.withClaim("id",user.getIdUsuarios())
					.withClaim("nome",user.getNomeUsuarios())
					.withClaim("role",user.getRoleUsuarios().name())
					.withExpiresAt(genExpirationDate())
					.sign(alg);

			logger.info(
					"JWT gerado para {}",
					user.getEmailUsuarios()
			);

			return token;
		}catch (JWTCreationException e){

			logger.error("Erro ao gerar JWT", e);

			throw new RuntimeException("Error while generating token", e);
		}
	}
	
	public String validateToken(String token) {
		try {
			Algorithm alg = Algorithm.HMAC256(secret);
			return JWT.require(alg)
					.withIssuer("auth-api")
					.build()
					.verify(token)
					.getSubject();
		}catch (JWTVerificationException e){

			logger.warn(
					"Falha na validação do JWT: {}",
					e.getMessage()
			);

			return null;
		}
	}
	
	private Instant genExpirationDate() {
		return LocalDateTime.now().plusMinutes(15).toInstant(ZoneOffset.of("-03:00"));
	}
	
}
