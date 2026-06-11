package LinguRemi.controller;

import LinguRemi.DTO.CheckoutDTO;
import LinguRemi.DTO.CheckoutItemDTO;
import LinguRemi.DTO.PedidoHistoricoDTO;
import LinguRemi.Enum.PedidoStatus;
import LinguRemi.mapper.PedidoMapper;
import LinguRemi.model.Pedido;
import LinguRemi.model.PedidoItem;
import LinguRemi.model.Receitas;
import LinguRemi.model.Usuarios;
import LinguRemi.repository.PedidoRepository;
import LinguRemi.repository.ReceitasRepository;
import LinguRemi.service.CheckoutService;
import LinguRemi.service.MercadoPagoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.*;

@RestController
@RequestMapping("/checkout")
public class CheckoutController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ReceitasRepository receitasRepository;

    @Autowired
    private MercadoPagoService mercadoPagoService;

    @Autowired
    private PedidoMapper pedidoMapper;

    @Autowired
    private CheckoutService checkoutService;

    @Value("${mercadopago.webhook.secret}")
    private String webhookSecret;

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
        }

        pedido.setItens(itens);
        pedido.setValorTotal(valorTotal);
        pedidoRepository.save(pedido);

        try {
            String linkPagamento = mercadoPagoService.criarPagamento(pedido);
            pedido.setLinkPagamento(linkPagamento);
            pedidoRepository.save(pedido);

            return ResponseEntity.ok(pedidoMapper.toDTO(pedido));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Erro ao gerar pagamento: " + e.getMessage());
        }
    }

    @GetMapping("/pedido/{id}")
    public ResponseEntity<?> buscarPedido(@PathVariable Long id) {
        return pedidoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/meus")
    public List<PedidoHistoricoDTO> meusPedidos(
            @AuthenticationPrincipal Usuarios usuario
    ) {

        return pedidoRepository
                .findByEmailUsuario(
                        usuario.getEmailUsuarios()
                )
                .stream()
                .sorted(
                        Comparator.comparing(
                                Pedido::getCriadoEm
                        ).reversed()
                ).map(pedido -> new PedidoHistoricoDTO(
                        pedido.getId(),

                        pedido.getItens().isEmpty()
                                ? "Pedido"
                                : pedido.getItens()
                                .get(0)
                                .getProduto()
                                .getNomeReceitas(),

                        pedido.getValorTotal(),

                        pedido.getCriadoEm().toString()
                ))
                .toList();
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> receberWebhook(
            @RequestBody Map<String, Object> body,
            @RequestParam String token
    ) {

        if (!token.equals(webhookSecret)) {
            return ResponseEntity.status(403).build();
        }

        checkoutService.processarWebhook(body);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/pedido/{id}/cancelar")
    public ResponseEntity<?> cancelarPedido(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuarios usuario
    ) {
        Optional<Pedido> pedidoOpt = pedidoRepository.findById(id);

        if (pedidoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Pedido pedido = pedidoOpt.get();

        if (!pedido.getEmailUsuario().equals(usuario.getEmailUsuarios())) {
            return ResponseEntity.status(403).body("Você não pode cancelar este pedido");
        }

        if (pedido.getStatus() == PedidoStatus.PAGO) {
            return ResponseEntity.badRequest().body("Pedido pago não pode ser cancelado por esta rota");
        }

        if (pedido.getStatus() == PedidoStatus.CANCELADO) {
            return ResponseEntity.badRequest().body("Pedido já está cancelado");
        }

        pedido.setStatus(PedidoStatus.CANCELADO);
        pedidoRepository.save(pedido);

        return ResponseEntity.ok(pedidoMapper.toDTO(pedido));
    }
}