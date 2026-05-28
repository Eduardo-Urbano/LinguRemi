package LinguRemi.repository;

import java.time.Instant;
import LinguRemi.model.RefreshToken;
import LinguRemi.model.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    void deleteByUsuario(Usuarios usuario);

    void deleteByExpiresAtBefore(Instant now);
}
