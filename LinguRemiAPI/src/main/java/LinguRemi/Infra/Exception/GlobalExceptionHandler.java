package LinguRemi.Infra.Exception;

import LinguRemi.DTO.ErrorResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger =
            LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGeneric(Exception ex) {

        logger.error(
                "[ERRO INTERNO]",
                ex
        );

        return ResponseEntity.status(500)
                .body(new ErrorResponseDTO(
                            500,
                            "INTERNAL_ERROR",
                            "Erro interno do servidor",
                            LocalDateTime.now().toString()
                ));
    }

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

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(
            MethodArgumentNotValidException ex
    ) {

        Map<String, String> erros = new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        erros.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        return ResponseEntity.badRequest().body(erros);
    }

    @ExceptionHandler(InvalidRefreshTokenException.class)
    public ResponseEntity<ErrorResponseDTO> handleInvalidRefreshToken(
            InvalidRefreshTokenException ex
    ) {
        return ResponseEntity.status(401)
                .body(new ErrorResponseDTO(
                        401,
                        "INVALID_REFRESH_TOKEN",
                        ex.getMessage(),
                        LocalDateTime.now().toString()
                ));
    }

    @ExceptionHandler(ExpiredRefreshTokenException.class)
    public ResponseEntity<ErrorResponseDTO>handleExpiredRefreshToken(
            ExpiredRefreshTokenException ex
    ){
        return ResponseEntity.status(401)
                .body(new ErrorResponseDTO(
                        401,
                        "EXPIRED_REFRESH_TOKEN",
                        ex.getMessage(),
                        LocalDateTime.now().toString()
                ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponseDTO> handleIllegalArgument(
            IllegalArgumentException ex
    ) {
        return ResponseEntity.badRequest()
                .body(new ErrorResponseDTO(
                            400,
                            "INVALID_ARGUMENT",
                            ex.getMessage(),
                            LocalDateTime.now().toString()
                ));
    }
}
