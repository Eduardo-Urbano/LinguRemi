package LinguRemi.service;

import LinguRemi.repository.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class RefreshTokenCleanupService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Transactional
    @Scheduled(cron = "0 0 3 * * *")
    public void limparTokensExpirados() {
        refreshTokenRepository.deleteByExpiresAtBefore(Instant.now());
    }
}