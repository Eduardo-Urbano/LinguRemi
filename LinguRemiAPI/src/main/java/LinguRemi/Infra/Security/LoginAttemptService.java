package LinguRemi.Infra.Security;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 3;

    private final ConcurrentHashMap<String, LoginAttemptData> attempts =
            new ConcurrentHashMap<>();

    public boolean isBlocked(String email) {

        LoginAttemptData data = attempts.get(email);

        if (data == null) {
            return false;
        }

        if (System.currentTimeMillis() >= data.getLockedUntil()) {

            data.setLockedUntil(0);

            return false;
        }

        return true;
    }

    public void registerFailure(String email) {

        LoginAttemptData data = attempts.computeIfAbsent(
                email,
                key -> new LoginAttemptData()
        );

        data.setFailedAttempts(
                data.getFailedAttempts() + 1
        );

        if (data.getFailedAttempts() >= MAX_ATTEMPTS) {

            data.setLockCount(
                    data.getLockCount() + 1
            );

            long blockTime = getBlockTime(
                    data.getLockCount()
            );

            data.setLockedUntil(
                    System.currentTimeMillis() + blockTime
            );

            data.setFailedAttempts(0);
        }
    }

    public void registerSuccess(String email) {
        attempts.remove(email);
    }

    private long getBlockTime(int lockCount) {

        return switch (lockCount) {

            case 1 -> 60_000L;      // 1 minuto

            case 2 -> 300_000L;     // 5 minutos

            case 3 -> 900_000L;     // 15 minutos

            default -> 1_800_000L;  // 30 minutos
        };
    }
}