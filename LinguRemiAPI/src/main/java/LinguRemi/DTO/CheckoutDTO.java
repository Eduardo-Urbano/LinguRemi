package LinguRemi.DTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record CheckoutDTO(

        @NotEmpty(message = "O pedido deve conter pelo menos um item")
        List<@Valid CheckoutItemDTO> itens

) {
}