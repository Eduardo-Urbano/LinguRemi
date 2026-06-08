package LinguRemi.service;

import LinguRemi.model.RefreshToken;
import LinguRemi.model.Usuarios;
import LinguRemi.repository.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class RefreshTokenService {
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    private static final Logger logger =
            LoggerFactory.getLogger(RefreshTokenService.class);

    @Transactional
    public RefreshToken criarRefreshToken(Usuarios usuario) {
        refreshTokenRepository.deleteByUsuario(usuario);

        RefreshToken refreshToken = new RefreshToken(
                UUID.randomUUID().toString(),
                Instant.now().plusSeconds(7 * 24 * 60 * 60),
                usuario
        );

        logger.info(
                "Refresh token criado para {}",
                usuario.getEmailUsuarios()
        );

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken validarRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token inválido"));

        if (refreshToken.isRevoked()) {
            throw new RuntimeException("Refresh token revogado");
        }

        if (refreshToken.getExpiresAt().isBefore(Instant.now())) {
            throw new RuntimeException("Refresh token expirado");
        }

        logger.info(
                "Refresh token validado para {}",
                refreshToken.getUsuario().getEmailUsuarios()
        );

        return refreshToken;
    }

    @Transactional
    public void revogarRefreshToken(String token){
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token não encontrado"));
        refreshToken.setRevoked(true);

        logger.info(
                "Refresh token revogado para {}",
                refreshToken.getUsuario().getEmailUsuarios()
        );

        refreshTokenRepository.save(refreshToken);
    }
}
