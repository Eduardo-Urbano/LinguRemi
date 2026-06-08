package LinguRemi.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "Receitas")
public class Receitas {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long idReceitas;

	@Column(nullable = false)
	private String nomeReceitas;

	@Column(nullable = false)
	private String descReceitas;

	@Column(nullable = false)
	private String tipoquantidadeReceitas;

	private double valorReceitas
			;
	private String imgReceitas;

	@DecimalMin("0.0")
	@DecimalMax("5.0")
	private double avaliacaoReceitas;

	@Column(nullable = false)
	private Double disponivelReceitas;

	public Receitas(long idReceitas, String nomeReceitas, String descReceitas, double valorReceitas, String imgReceitas, double avaliacaoReceitas, Double disponivelReceitas, String tipoquantidadeReceitas) {
		super();
		this.idReceitas = idReceitas;
		this.nomeReceitas = nomeReceitas;
		this.descReceitas = descReceitas;
		this.valorReceitas = valorReceitas;
		this.imgReceitas = imgReceitas;
        this.avaliacaoReceitas = avaliacaoReceitas;
        this.disponivelReceitas = disponivelReceitas;
        this.tipoquantidadeReceitas = tipoquantidadeReceitas;
    }

	public Receitas() {

	}

	public long getIdReceitas() {
		return idReceitas;
	}
	public void setIdReceitas(long idReceitas) {
		this.idReceitas = idReceitas;
	}
	public String getNomeReceitas() {
		return nomeReceitas;
	}
	public void setNomeReceitas(String nomeReceitas) {
		this.nomeReceitas = nomeReceitas;
	}

	public double getValorReceitas() {
		return valorReceitas;
	}
	public void setValorReceitas(double valorReceitas) {
		this.valorReceitas = valorReceitas;
	}

	public String getImgReceitas() {
		return imgReceitas;
	}

	public void setImgReceitas(String imgReceitas) {
		this.imgReceitas = imgReceitas;
	}

	public double getAvaliacaoReceitas() {
		return avaliacaoReceitas;
	}

	public void setAvaliacaoReceitas(double avaliacaoReceitas) {
		this.avaliacaoReceitas = avaliacaoReceitas;
	}

	public Double getDisponivelReceitas() {
		return disponivelReceitas;
	}

	public void setDisponivelReceitas(Double disponivelReceitas) {
		this.disponivelReceitas = disponivelReceitas;
	}	
	
	
	public String getDescReceitas() {
		return descReceitas;
	}

	public void setDescReceitas(String descReceitas) {
		this.descReceitas = descReceitas;
	}	
	
	public String getTipoquantidadeReceitas() {
		return tipoquantidadeReceitas;
	}

	public void setTipoquantidadeReceitas(String tipoquantidadeReceitas) {
		this.tipoquantidadeReceitas = tipoquantidadeReceitas;
	}

	
	
}
