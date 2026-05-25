package LinguRemi.DTO;

import java.util.List;

public record CheckoutDTO(
        List<CheckoutItemDTO> itens
) {
}