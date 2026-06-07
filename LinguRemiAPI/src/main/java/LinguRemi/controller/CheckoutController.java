package LinguRemi.controller;

import java.util.Map;

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
import LinguRemi.service.MercadoPagoService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/checkout")
public class CheckoutController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ReceitasRepository receitasRepository;

    @Autowired
    private MercadoPagoService mercadoPagoService;

    private static final Logger logger =
            LoggerFactory.getLogger(CheckoutController.class);

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

            return ResponseEntity.ok(pedido);

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

    @GetMapping("/meus-pedidos")
    public ResponseEntity<?> meusPedidos(@AuthenticationPrincipal Usuarios usuario) {
        return ResponseEntity.ok(
                pedidoRepository.findByEmailUsuario(usuario.getEmailUsuarios())
        );
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> receberWebhook(@RequestBody Map<String, Object> body) {

        logger.info("[WEBHOOK] Notificação recebida: {}", body);

        try {

            Object type = body.get("type");
            Object dataObj = body.get("data");

            logger.info(
                    "[WEBHOOK] Tipo recebido: {}",
                    type
            );

            if (!"payment".equals(type) || dataObj == null) {

                logger.warn(
                        "[WEBHOOK] Ignorado - tipo inválido"
                );

                return ResponseEntity.ok().build();
            }

            Map<String, Object> data = (Map<String, Object>) dataObj;

            Long paymentId =
                    Long.valueOf(data.get("id").toString());

            logger.info(
                    "[WEBHOOK] Payment ID: {}",
                    paymentId
            );

            var pagamento =
                    mercadoPagoService.buscarPagamento(paymentId);

            logger.info(
                    "[WEBHOOK] Status pagamento: {}",
                    pagamento.getStatus()
            );

            if ("approved".equals(pagamento.getStatus())) {

                Long pedidoId =
                        Long.valueOf(
                                pagamento.getExternalReference()
                        );

                logger.info(
                        "[WEBHOOK] Pedido {} aprovado",
                        pedidoId
                );

                Pedido pedido =
                        pedidoRepository.findById(pedidoId)
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Pedido não encontrado"
                                        )
                                );

                if (pedido.getStatus() != PedidoStatus.PAGO) {

                    for (PedidoItem item : pedido.getItens()) {

                        Receitas produto = item.getProduto();

                        logger.info(
                                "[ESTOQUE] {} | Atual: {} | Baixa: {}",
                                produto.getNomeReceitas(),
                                produto.getDisponivelReceitas(),
                                item.getQuantidade()
                        );

                        if (produto.getDisponivelReceitas()
                                < item.getQuantidade()) {

                            logger.error(
                                    "[ESTOQUE] Estoque insuficiente para {}",
                                    produto.getNomeReceitas()
                            );

                            pedido.setStatus(
                                    PedidoStatus.CANCELADO
                            );

                            pedidoRepository.save(pedido);

                            return ResponseEntity.badRequest()
                                    .body("Estoque insuficiente");
                        }

                        produto.setDisponivelReceitas(
                                produto.getDisponivelReceitas()
                                        - item.getQuantidade()
                        );

                        receitasRepository.save(produto);
                    }

                    pedido.setStatus(PedidoStatus.PAGO);

                    pedidoRepository.save(pedido);

                    logger.info(
                            "[PEDIDO] Pedido {} marcado como PAGO",
                            pedidoId
                    );
                }
            }

            return ResponseEntity.ok().build();

        } catch (Exception e) {

            logger.error(
                    "[WEBHOOK ERROR]",
                    e
            );

            return ResponseEntity.internalServerError()
                    .body(
                            "Erro ao processar webhook: "
                                    + e.getMessage()
                    );
        }
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

        return ResponseEntity.ok(pedido);
    }
}