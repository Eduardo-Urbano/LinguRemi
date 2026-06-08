package LinguRemi.service;

import LinguRemi.model.Pedido;
import LinguRemi.model.PedidoItem;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class MercadoPagoService {

    @Value("${mercadopago.access.token}")
    private String accessToken;

    public String criarPagamento(Pedido pedido) throws Exception {

        MercadoPagoConfig.setAccessToken(accessToken);

        List<PreferenceItemRequest> items = new ArrayList<>();

        for (PedidoItem item : pedido.getItens()) {

            PreferenceItemRequest itemRequest =
                    PreferenceItemRequest.builder()
                            .title(item.getProduto().getNomeReceitas())
                            .quantity(item.getQuantidade().intValue())
                            .currencyId("BRL")
                            .unitPrice(BigDecimal.valueOf(item.getValorUnitario()))
                            .build();

            items.add(itemRequest);
        }

        PreferenceBackUrlsRequest backUrls =
                PreferenceBackUrlsRequest.builder()
                        .success("http://localhost:5173/sucesso")
                        .failure("http://localhost:5173/falha")
                        .pending("http://localhost:5173/pendente")
                        .build();

        PreferenceRequest preferenceRequest =
                PreferenceRequest.builder()
                        .items(items)
                        .backUrls(backUrls)
                        .externalReference(pedido.getId().toString())
                        .notificationUrl("https://linguremi-api.onrender.com/checkout/webhook")
                        .build();

        PreferenceClient client = new PreferenceClient();

        Preference preference = client.create(preferenceRequest);

        return preference.getSandboxInitPoint();
    }

    public Payment buscarPagamento(Long paymentId) throws Exception {
        MercadoPagoConfig.setAccessToken(accessToken);

        PaymentClient client = new PaymentClient();

        return client.get(paymentId);
    }
}