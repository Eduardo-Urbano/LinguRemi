package LinguRemi.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class LoteInsumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLote;

    @ManyToOne
    @JoinColumn(name = "id_insumo", nullable = false)
    private Insumo insumo;

    @Column(nullable = false)
    private Double quantidadeInicial;

    @Column(nullable = false)
    private Double quantidadeAtual; 
    
    private LocalDate dataEntrada;

    @Column(nullable = false)
    private LocalDate dataValidade;

    
	public LoteInsumo() {
		super();
	}

	public LoteInsumo(Long idLote, Insumo insumo, Double quantidadeInicial, Double quantidadeAtual,
			LocalDate dataEntrada, LocalDate dataValidade) {
		super();
		this.idLote = idLote;
		this.insumo = insumo;
		this.quantidadeInicial = quantidadeInicial;
		this.quantidadeAtual = quantidadeAtual;
		this.dataEntrada = dataEntrada;
		this.dataValidade = dataValidade;
	}

	public Long getIdLote() {
		return idLote;
	}

	public void setIdLote(Long idLote) {
		this.idLote = idLote;
	}

	public Insumo getInsumo() {
		return insumo;
	}

	public void setInsumo(Insumo insumo) {
		this.insumo = insumo;
	}

	public Double getQuantidadeInicial() {
		return quantidadeInicial;
	}

	public void setQuantidadeInicial(Double quantidadeInicial) {
		this.quantidadeInicial = quantidadeInicial;
	}

	public Double getQuantidadeAtual() {
		return quantidadeAtual;
	}

	public void setQuantidadeAtual(Double quantidadeAtual) {
		this.quantidadeAtual = quantidadeAtual;
	}

	public LocalDate getDataEntrada() {
		return dataEntrada;
	}

	public void setDataEntrada(LocalDate dataEntrada) {
		this.dataEntrada = dataEntrada;
	}

	public LocalDate getDataValidade() {
		return dataValidade;
	}

	public void setDataValidade(LocalDate dataValidade) {
		this.dataValidade = dataValidade;
	}

    
    
}