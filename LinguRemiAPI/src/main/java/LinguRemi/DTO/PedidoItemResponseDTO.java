package LinguRemi.DTO;

public record PedidoItemResponseDTO(
        Long produtoId,
        String nomeProduto,
        Double quantidade,
        Double valorUnitario
) {}
