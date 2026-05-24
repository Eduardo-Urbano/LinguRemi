package LinguRemi.service;

import LinguRemi.model.RefreshToken;
import LinguRemi.model.Usuarios;
import LinguRemi.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class RefreshTokenService {
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public RefreshToken criarRefreshToken(Usuarios usuario) {
        refreshTokenRepository.deleteByUsuario(usuario);

        RefreshToken refreshToken = new RefreshToken(
                UUID.randomUUID().toString(),
                Instant.now().plusSeconds(7 * 24 * 60 * 60),
                usuario
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

        return refreshToken;
    }

    @Transactional
    public void revogarRefreshToken(String token){
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token não encontrado"));
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
    }
}
