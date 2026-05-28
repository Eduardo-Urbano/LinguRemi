package LinguRemi.DTO;

public record LoginResponseDTO(
        String acessToken,
        String refreshToken,
        String nome,
        String email,
        String role
) {}
