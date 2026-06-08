package LinguRemi.Infra.Security;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 3;
    private static final long MINUTE = 60_000L;

    private final ConcurrentHashMap<String, LoginAttemptData> attempts =
            new ConcurrentHashMap<>();

    public boolean isBlocked(String email) {

        email = email.toLowerCase().trim();

        LoginAttemptData data = attempts.get(email);

        if (data == null) {
            return false;
        }

        if (System.currentTimeMillis() >= data.getLockedUntil()) {

            attempts.remove(email);

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
            case 1 -> MINUTE;           // 1 minuto
            case 2 -> 5 * MINUTE;       // 5 minutos
            case 3 -> 15 * MINUTE;      // 15 minutos
            default -> 30 * MINUTE;     // 30 minutos
        };
    }
}