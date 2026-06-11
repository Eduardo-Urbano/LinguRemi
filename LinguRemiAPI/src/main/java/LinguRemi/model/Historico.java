package LinguRemi.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Historico")
public class Historico {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long idHistorico;

	@Column(nullable = false)
	private String emailTransferencia;

	@Positive
	@Column(nullable = false)
	private Double valorTransferencia;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
	@Column(nullable = false)
	private ZonedDateTime dataTransferencia;

	@Column(nullable = false)
	private String descTransferencia;

	@Positive
	@Column(nullable = false)
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