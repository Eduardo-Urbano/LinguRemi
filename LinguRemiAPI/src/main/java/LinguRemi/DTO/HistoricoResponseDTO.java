package LinguRemi.DTO;

import java.time.ZonedDateTime;

public class HistoricoResponseDTO {

    private long idHistorico;
    private String nomeItem;
    private Double valorTotal;
    private ZonedDateTime dataCompra;

    public HistoricoResponseDTO(
            long idHistorico,
            String nomeItem,
            Double valorTotal,
            ZonedDateTime dataCompra
    ) {
        this.idHistorico = idHistorico;
        this.nomeItem = nomeItem;
        this.valorTotal = valorTotal;
        this.dataCompra = dataCompra;
    }

    public long getIdHistorico() {
        return idHistorico;
    }

    public String getNomeItem() {
        return nomeItem;
    }

    public Double getValorTotal() {
        return valorTotal;
    }

    public ZonedDateTime getDataCompra() {
        return dataCompra;
    }
}