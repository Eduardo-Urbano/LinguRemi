package LinguRemi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Receitas")
public class Receitas {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long idReceitas;
	private String nomeReceitas;
	private String descricaoReceitas;
	private double valorReceitas;
	private String imgReceitas;
	
	public Receitas() {
		super();
	}
	
	public Receitas(long idReceitas, String nomeReceitas, String descricaoReceitas, double valorReceitas, String imgReceitas) {
		super();
		this.idReceitas = idReceitas;
		this.nomeReceitas = nomeReceitas;
		this.descricaoReceitas = descricaoReceitas;
		this.valorReceitas = valorReceitas;
		this.imgReceitas = imgReceitas;
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
	public String getDescricaoReceitas() {
		return descricaoReceitas;
	}
	public void setDescricaoReceitas(String descricaoReceitas) {
		this.descricaoReceitas = descricaoReceitas;
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
	
}
