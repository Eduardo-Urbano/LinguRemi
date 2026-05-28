package LinguRemi.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record ProdutoDTO(
        @NotBlank String nome,
        @NotBlank String descricao,
        @NotNull @Positive Double valor,
        String imagem,
        @NotNull @PositiveOrZero double disponivel,
        @NotBlank String tipoQuantidade
) {
}