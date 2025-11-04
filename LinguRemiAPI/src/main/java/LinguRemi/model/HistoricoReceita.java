package LinguRemi.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "HistoricoReceita")
public class HistoricoReceita {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "idHistorico")
    @JsonBackReference
    private Historico historico;
    @ManyToOne
    @JoinColumn(name = "idReceita")
    private Receitas receita;
    private double quantidade;
    
	public HistoricoReceita() {
		super();
	}
	
	public HistoricoReceita(Long id, Historico historico, Receitas receita, double quantidade) {
		super();
		this.id = id;
		this.historico = historico;
		this.receita = receita;
		this.quantidade = quantidade;
	}
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Historico getHistorico() {
		return historico;
	}
	public void setHistorico(Historico historico) {
		this.historico = historico;
	}
	public Receitas getReceita() {
		return receita;
	}
	public void setReceita(Receitas receita) {
		this.receita = receita;
	}
	public double getQuantidade() {
		return quantidade;
	}
	public void setQuantidade(double quantidade) {
		this.quantidade = quantidade;
	}


}


