package LinguRemi.model;

import java.time.ZonedDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Historico")
public class Historico {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long idHistorico;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idUsuarios")
	private Usuarios usuario;
	private String emailTransferencia;
	private Double valorTransferencia;
	private ZonedDateTime dataTransferencia;
	private String descTransferencia;
	
	public Historico() {
		super();
	}

	public Historico(long idHistorico, String emailTransferencia, Double valorTransferencia,
			ZonedDateTime dataTransferencia, String descTransferencia) {
		super();
		this.idHistorico = idHistorico;
		this.emailTransferencia = emailTransferencia;
		this.valorTransferencia = valorTransferencia;
		this.dataTransferencia = dataTransferencia;
		this.descTransferencia = descTransferencia;
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
	
	
}