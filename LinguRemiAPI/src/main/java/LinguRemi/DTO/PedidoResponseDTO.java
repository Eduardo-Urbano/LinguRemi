package LinguRemi.DTO;

import java.util.List;

public record PedidoResponseDTO(
        Long id,
        String emailUsuario,
        Double valorTotal,
        String status,
        String criadoEm,
        String linkPagamento,
        List<PedidoItemResponseDTO> itens
) {}
