package LinguRemi.DTO;

public record ErrorResponseDTO(
        int status,
        String error,
        String message,
        String timestamp
) {}
