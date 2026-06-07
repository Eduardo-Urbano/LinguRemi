package LinguRemi.model;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "Historico")
public class Historico {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long idHistorico;
	private String emailTransferencia;
	private Double valorTransferencia;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
	private ZonedDateTime dataTransferencia;
	private String descTransferencia;
	private double quantidadeTransferencia;
	@OneToMany(mappedBy = "historico", cascade = CascadeType.ALL)
	@JsonManagedReference
	private List<HistoricoReceita> itens = new ArrayList<>();
	
	public Historico() {
		super();
	}

	public Historico(long idHistorico, String emailTransferencia, Double valorTransferencia,
			ZonedDateTime dataTransferencia, String descTransferencia, double quantidadeTransferencia,
			List<HistoricoReceita> itens) {
		super();
		this.idHistorico = idHistorico;
		this.emailTransferencia = emailTransferencia;
		this.valorTransferencia = valorTransferencia;
		this.dataTransferencia = dataTransferencia;
		this.descTransferencia = descTransferencia;
		this.quantidadeTransferencia = quantidadeTransferencia;
		this.itens = itens;
	}

	public long getIdHistorico() {
		return idHistorico;
	}

	public void setIdHistorico(long idHistorico) {
		this.idHistorico = idHistorico;
	}

	public String getEmailTransferencia() {
		return emailTransferencia;
	}

	public void setEmailTransferencia(String emailTransferencia) {
		this.emailTransferencia = emailTransferencia;
	}

	public Double getValorTransferencia() {
		return valorTransferencia;
	}

	public void setValorTransferencia(Double valorTransferencia) {
		this.valorTransferencia = valorTransferencia;
	}

	public ZonedDateTime getDataTransferencia() {
		return dataTransferencia;
	}

	public void setDataTransferencia(ZonedDateTime dataTransferencia) {
		this.dataTransferencia = dataTransferencia;
	}

	public String getDescTransferencia() {
		return descTransferencia;
	}

	public void setDescTransferencia(String descTransferencia) {
		this.descTransferencia = descTransferencia;
	}

	public double getQuantidadeTransferencia() {
		return quantidadeTransferencia;
	}

	public void setQuantidadeTransferencia(double quantidadeTransferencia) {
		this.quantidadeTransferencia = quantidadeTransferencia;
	}

	public List<HistoricoReceita> getItens() {
		return itens;
	}

	public void setItens(List<HistoricoReceita> itens) {
		this.itens = itens;
	}
	

	
}