package LinguRemi.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CheckoutItemDTO(

        @NotNull(message = "Produto é obrigatório")
        Long produtoId,

        @NotNull(message = "Quantidade é obrigatória")
        @Positive(message = "Quantidade deve ser maior que zero")
        Double quantidade

) {
}