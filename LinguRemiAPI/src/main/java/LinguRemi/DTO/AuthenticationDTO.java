package LinguRemi.DTO;

import jakarta.validation.constraints.NotBlank;

public record AuthenticationDTO(

        @NotBlank(message = "Login é obrigatório")
        String login,

        @NotBlank(message = "Senha é obrigatória")
        String password

) {
}