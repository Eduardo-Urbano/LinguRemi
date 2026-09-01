package LinguRemi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Insumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInsumo;

    @Column(nullable = false)
    private String nomeInsumo;

    @Column(nullable = false)
    private String unidadeMedida;

    @Column(nullable = false)
    private Double estoqueAtual; 

    @Column(nullable = false)
    private Double estoqueMinimo; 

    private Double custoUnitario;
    @Column(nullable = false)
    private Boolean ativoInsumo;
    
	public Insumo() {
		super();
	}
	
	public Insumo(Long idInsumo, String nomeInsumo, String unidadeMedida, Double estoqueAtual, Double estoqueMinimo,
			Double custoUnitario, Boolean ativoInsumo) {
		super();
		this.idInsumo = idInsumo;
		this.nomeInsumo = nomeInsumo;
		this.unidadeMedida = unidadeMedida;
		this.estoqueAtual = estoqueAtual;
		this.estoqueMinimo = estoqueMinimo;
		this.custoUnitario = custoUnitario;
		this.ativoInsumo = ativoInsumo;
	}
	
	public Long getIdInsumo() {
		return idInsumo;
	}
	public void setIdInsumo(Long idInsumo) {
		this.idInsumo = idInsumo;
	}
	public String getNomeInsumo() {
		return nomeInsumo;
	}
	public void setNomeInsumo(String nomeInsumo) {
		this.nomeInsumo = nomeInsumo;
	}
	public String getUnidadeMedida() {
		return unidadeMedida;
	}
	public void setUnidadeMedida(String unidadeMedida) {
		this.unidadeMedida = unidadeMedida;
	}
	public Double getEstoqueAtual() {
		return estoqueAtual;
	}
	public void setEstoqueAtual(Double estoqueAtual) {
		this.estoqueAtual = estoqueAtual;
	}
	public Double getEstoqueMinimo() {
		return estoqueMinimo;
	}
	public void setEstoqueMinimo(Double estoqueMinimo) {
		this.estoqueMinimo = estoqueMinimo;
	}
	public Double getCustoUnitario() {
		return custoUnitario;
	}
	public void setCustoUnitario(Double custoUnitario) {
		this.custoUnitario = custoUnitario;
	}
	public Boolean getAtivoInsumo() {
		return ativoInsumo;
	}
	public void setAtivoInsumo(Boolean ativoInsumo) {
		this.ativoInsumo = ativoInsumo;
	}

    
    
}
