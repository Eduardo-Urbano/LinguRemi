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
	private String descReceitas;
	private double valorReceitas;
	private String imgReceitas;
	private double avaliacaoReceitas;
	private int disponivelReceitas;
	private String tipoquantidadeReceitas;
	

	public Receitas(long idReceitas, String nomeReceitas, String descReceitas, double valorReceitas, String imgReceitas, double avaliacaoReceitas, int disponivelReceitas, String tipoquantidadeReceitas) {
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

	public int getDisponivelReceitas() {
		return disponivelReceitas;
	}

	public void setDisponivelReceitas(int disponivelReceitas) {
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
