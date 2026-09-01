package LinguRemi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class ReceitaInsumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReceitaInsumo;

    @ManyToOne
    @JoinColumn(name = "id_receitas", nullable = false)
    private Receitas receita; // sua entidade de produto atual

    @ManyToOne
    @JoinColumn(name = "id_insumo", nullable = false)
    private Insumo insumo;

    @Column(nullable = false)
    private Double quantidadePorUnidade; // ex: 0.25 kg de farinha por bolo
    
	public ReceitaInsumo() {
		super();
	}

	public ReceitaInsumo(Long idReceitaInsumo, Receitas receita, Insumo insumo, Double quantidadePorUnidade) {
		super();
		this.idReceitaInsumo = idReceitaInsumo;
		this.receita = receita;
		this.insumo = insumo;
		this.quantidadePorUnidade = quantidadePorUnidade;
	}

	public Long getIdReceitaInsumo() {
		return idReceitaInsumo;
	}

	public void setIdReceitaInsumo(Long idReceitaInsumo) {
		this.idReceitaInsumo = idReceitaInsumo;
	}

	public Receitas getReceita() {
		return receita;
	}

	public void setReceita(Receitas receita) {
		this.receita = receita;
	}

	public Insumo getInsumo() {
		return insumo;
	}

	public void setInsumo(Insumo insumo) {
		this.insumo = insumo;
	}

	public Double getQuantidadePorUnidade() {
		return quantidadePorUnidade;
	}

	public void setQuantidadePorUnidade(Double quantidadePorUnidade) {
		this.quantidadePorUnidade = quantidadePorUnidade;
	}
    
    
}