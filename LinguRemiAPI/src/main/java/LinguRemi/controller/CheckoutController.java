package LinguRemi.controller;

import LinguRemi.DTO.CheckoutDTO;
import LinguRemi.DTO.CheckoutItemDTO;
import LinguRemi.Enum.PedidoStatus;
import LinguRemi.model.Pedido;
import LinguRemi.model.PedidoItem;
import LinguRemi.model.Receitas;
import LinguRemi.model.Usuarios;
import LinguRemi.repository.PedidoRepository;
import LinguRemi.repository.ReceitasRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/checkout")
public class CheckoutController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ReceitasRepository receitasRepository;

    @PostMapping("/criar")
    public ResponseEntity<?> criarCheckout(
            @RequestBody @Valid CheckoutDTO dto,
            @AuthenticationPrincipal Usuarios usuario
    ) {
        Pedido pedido = new Pedido();
        pedido.setEmailUsuario(usuario.getEmailUsuarios());
        pedido.setStatus(PedidoStatus.PENDENTE);
        pedido.setCriadoEm(ZonedDateTime.now());

        List<PedidoItem> itens = new ArrayList<>();
        double valorTotal = 0.0;

        for (CheckoutItemDTO itemDTO : dto.itens()) {
            Receitas produto = receitasRepository.findById(itemDTO.produtoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

            if (produto.getDisponivelReceitas() < itemDTO.quantidade()) {
                return ResponseEntity.badRequest().body("Estoque insuficiente para: " + produto.getNomeReceitas());
            }

            PedidoItem item = new PedidoItem();
            item.setPedido(pedido);
            item.setProduto(produto);
            item.setQuantidade(itemDTO.quantidade());
            item.setValorUnitario(produto.getValorReceitas());

            itens.add(item);

            valorTotal += produto.getValorReceitas() * itemDTO.quantidade();

            produto.setDisponivelReceitas(produto.getDisponivelReceitas() - itemDTO.quantidade());
            receitasRepository.save(produto);
        }

        pedido.setItens(itens);
        pedido.setValorTotal(valorTotal);
        pedido.setLinkPagamento(null);

        pedidoRepository.save(pedido);

        return ResponseEntity.ok(pedido);
    }

    @GetMapping("/pedido/{id}")
    public ResponseEntity<?> buscarPedido(@PathVariable Long id) {
        return pedidoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}