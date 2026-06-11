package LinguRemi.DTO;

public record PedidoHistoricoDTO(
        Long id,
        String nomeItem,
        Double valorTotal,
        String dataCompra
) {}
