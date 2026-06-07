package LinguRemi.Infra.Exception;

import LinguRemi.DTO.ErrorResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RateLimitException.class)
    public ResponseEntity<ErrorResponseDTO> handleRateLimit(RateLimitException ex) {
        return ResponseEntity.status(429)
                .body(new ErrorResponseDTO(
                        429,
                        "RATE_LIMIT_EXCEEDED",
                        ex.getMessage(),
                        LocalDateTime.now().toString()
                ));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponseDTO> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(401)
                .body(new ErrorResponseDTO(
                        401,
                        "INVALID_CREDENTIALS",
                        "Usuário ou senha inválidos",
                        LocalDateTime.now().toString()
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGeneric(Exception ex) {
        return ResponseEntity.status(500)
                .body(new ErrorResponseDTO(
                        500,
                        "INTERNAL_ERROR",
                        ex.getMessage(),
                        LocalDateTime.now().toString()
                ));
    }

    @ExceptionHandler(AccountLockedException.class)
    public ResponseEntity<ErrorResponseDTO> handleAccountLocked(
            AccountLockedException ex
    ) {

        return ResponseEntity.status(HttpStatus.LOCKED)
                .body(new ErrorResponseDTO(
                        423,
                        "ACCOUNT_LOCKED",
                        ex.getMessage(),
                        LocalDateTime.now().toString()
                ));
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<ErrorResponseDTO> handleAccessDenied(
            AccessDeniedException ex
    ) {
        return ResponseEntity.status(403)
                .body(new ErrorResponseDTO(
                        403,
                        "ACCESS_DENIED",
                        "Você não possui permissão para acessar este recurso",
                        LocalDateTime.now().toString()
                ));
    }
}
