package LinguRemi.DTO;

import java.time.ZonedDateTime;
import java.util.Optional;

import LinguRemi.model.Receitas;
import jakarta.persistence.ManyToOne;

public class HistoricoDTO {
	private Long receitaId;
	private double quantidade;
	private double precoUnitario;
	private String email;
	private double total;
	private String desc;
	
	
	public HistoricoDTO() {
		super();
	}
	
	public HistoricoDTO(Long receitaId, double quantidade, double precoUnitario, String email, double total,
			String desc) {
		super();
		this.receitaId = receitaId;
		this.quantidade = quantidade;
		this.precoUnitario = precoUnitario;
		this.email = email;
		this.total = total;
		this.desc = desc;
	}

	public Long getReceitaId() {
		return receitaId;
	}
	public void setReceitaId(Long receitaId) {
		this.receitaId = receitaId;
	}
	public double getQuantidade() {
		return quantidade;
	}
	public void setQuantidade(double quantidade) {
		this.quantidade = quantidade;
	}
	public double getPrecoUnitario() {
		return precoUnitario;
	}
	public void setPrecoUnitario(double precoUnitario) {
		this.precoUnitario = precoUnitario;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public double getTotal() {
		return total;
	}

	public void setTotal(double total) {
		this.total = total;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}
    
    
}
