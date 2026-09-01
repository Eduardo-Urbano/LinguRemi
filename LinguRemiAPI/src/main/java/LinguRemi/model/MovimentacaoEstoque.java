package LinguRemi.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class MovimentacaoEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMovimentacao;

    @ManyToOne
    @JoinColumn(name = "id_insumo", nullable = false)
    private Insumo insumo;

    @ManyToOne
    @JoinColumn(name = "id_lote")
    private LoteInsumo lote; // de qual lote específico saiu/entrou

    @Column(nullable = false)
    private String tipoMovimentacao; // "ENTRADA", "SAIDA_VENDA", "PERDA_VALIDADE", "PERDA_OUTRO"

    @Column(nullable = false)
    private Double quantidade;

    private String motivo; // texto livre, útil para PERDA_OUTRO ("quebrou", "queimou" etc.)

    @Column(nullable = false)
    private LocalDateTime dataMovimentacao;
    
	public MovimentacaoEstoque() {
		super();
	}

	public MovimentacaoEstoque(Long idMovimentacao, Insumo insumo, LoteInsumo lote, String tipoMovimentacao,
			Double quantidade, String motivo, LocalDateTime dataMovimentacao) {
		super();
		this.idMovimentacao = idMovimentacao;
		this.insumo = insumo;
		this.lote = lote;
		this.tipoMovimentacao = tipoMovimentacao;
		this.quantidade = quantidade;
		this.motivo = motivo;
		this.dataMovimentacao = dataMovimentacao;
	}

	public Long getIdMovimentacao() {
		return idMovimentacao;
	}

	public void setIdMovimentacao(Long idMovimentacao) {
		this.idMovimentacao = idMovimentacao;
	}

	public Insumo getInsumo() {
		return insumo;
	}

	public void setInsumo(Insumo insumo) {
		this.insumo = insumo;
	}

	public LoteInsumo getLote() {
		return lote;
	}

	public void setLote(LoteInsumo lote) {
		this.lote = lote;
	}

	public String getTipoMovimentacao() {
		return tipoMovimentacao;
	}

	public void setTipoMovimentacao(String tipoMovimentacao) {
		this.tipoMovimentacao = tipoMovimentacao;
	}

	public Double getQuantidade() {
		return quantidade;
	}

	public void setQuantidade(Double quantidade) {
		this.quantidade = quantidade;
	}

	public String getMotivo() {
		return motivo;
	}

	public void setMotivo(String motivo) {
		this.motivo = motivo;
	}

	public LocalDateTime getDataMovimentacao() {
		return dataMovimentacao;
	}

	public void setDataMovimentacao(LocalDateTime dataMovimentacao) {
		this.dataMovimentacao = dataMovimentacao;
	}
    
    
}