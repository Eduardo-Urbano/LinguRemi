package LinguRemi.mapper;

import LinguRemi.DTO.PedidoItemResponseDTO;
import LinguRemi.DTO.PedidoResponseDTO;
import LinguRemi.model.Pedido;
import org.springframework.stereotype.Component;

@Component
public class PedidoMapper {

    public PedidoResponseDTO toDTO(Pedido pedido) {
        return new PedidoResponseDTO(
                pedido.getId(),
                pedido.getEmailUsuario(),
                pedido.getValorTotal(),
                pedido.getStatus().name(),
                pedido.getCriadoEm().toString(),
                pedido.getLinkPagamento(),
                pedido.getItens().stream().map(item ->
                        new PedidoItemResponseDTO(
                                item.getProduto().getIdReceitas(),
                                item.getProduto().getNomeReceitas(),
                                item.getQuantidade(),
                                item.getValorUnitario()
                        )
                ).toList()
        );
    }
}