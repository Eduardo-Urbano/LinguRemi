package LinguRemi.service;

import LinguRemi.Enum.PedidoStatus;
import LinguRemi.model.Pedido;
import LinguRemi.model.PedidoItem;
import LinguRemi.model.Receitas;
import LinguRemi.repository.PedidoRepository;
import LinguRemi.repository.ReceitasRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CheckoutService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ReceitasRepository receitasRepository;

    @Autowired
    private MercadoPagoService mercadoPagoService;

    private static final Logger logger =
            LoggerFactory.getLogger(CheckoutService.class);

    @Transactional
    public void processarWebhook(Map<String, Object> body) {

        logger.info("[WEBHOOK] Recebido: {}", body);

        Object type = body.get("type");
        Object dataObj = body.get("data");

        if (!"payment".equals(type) || dataObj == null) {
            return;
        }

        Map<String, Object> data = (Map<String, Object>) dataObj;
        Long paymentId = Long.valueOf(data.get("id").toString());

        try {
            var pagamento = mercadoPagoService.buscarPagamento(paymentId);

            if (!"approved".equals(pagamento.getStatus())) {
                return;
            }

            Long pedidoId = Long.valueOf(pagamento.getExternalReference());

            Pedido pedido = pedidoRepository.findById(pedidoId)
                    .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

            if (pedido.getStatus() == PedidoStatus.PAGO) {
                logger.info("[WEBHOOK] Pedido já processado: {}", pedidoId);
                return;
            }
            if (pedido.getStatus() == PedidoStatus.CANCELADO){
                logger.info("[WEBHOOK] Pedido já cancelado: {}", pedidoId);
                return;
            }

            for (PedidoItem item : pedido.getItens()) {

                Receitas produto = receitasRepository.findByIdForUpdate(
                        item.getProduto().getIdReceitas()
                );

                if (produto.getDisponivelReceitas() < item.getQuantidade()) {
                    pedido.setStatus(PedidoStatus.CANCELADO);
                    pedidoRepository.save(pedido);
                    throw new RuntimeException("Estoque insuficiente");
                }

                produto.setDisponivelReceitas(
                        produto.getDisponivelReceitas() - item.getQuantidade()
                );

                receitasRepository.save(produto);
            }

            pedido.setStatus(PedidoStatus.PAGO);
            pedidoRepository.save(pedido);

            logger.info("[PEDIDO] Pedido {} atualizado para PAGO", pedidoId);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar pagamento", e);
        }

    }
}
