package LinguRemi.DTO;

public record UsuarioResponseDTO(
        Long id,
        String nome,
        String email,
        String role
) {}
