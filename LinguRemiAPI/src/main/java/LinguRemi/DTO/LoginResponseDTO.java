package LinguRemi.DTO;

public record LoginResponseDTO(
        String accessToken,
        String refreshToken,
        String nome,
        String email,
        String role
) {}
