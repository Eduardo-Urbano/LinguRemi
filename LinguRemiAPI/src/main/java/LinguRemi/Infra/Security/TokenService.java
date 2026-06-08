package LinguRemi.Infra.Security;

import LinguRemi.model.Usuarios;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class TokenService {
	@Value("${api.security.token.secret}")
	private String secret;
	@Value("${jwt.access.expiration}")
	private Long expirationMinutes;
	private static final Logger logger = LoggerFactory.getLogger(TokenService.class);
	private static final String ISSUER = "auth-api";
	
	public String generateToken(Usuarios user) {
		try {
			Algorithm alg = Algorithm.HMAC256(secret);
			String token = JWT.create()
					.withIssuer(ISSUER)
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
					.withIssuer(ISSUER)
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
		return Instant.now().plusSeconds(expirationMinutes * 60);
	}
	
}
