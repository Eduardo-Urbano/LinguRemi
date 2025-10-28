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
	private String ingredientesReceitas;
	private String modoDePreparoReceitas;
	private double valorReceitas;
	private String imgReceitas;

	private String autorEmail;//email do usuário que cadastrou a receita
	private String autorRole;//ADMIN ou USER para definir se vai ter opção de envio da receita

	private boolean paraProdutos;//True apenas se a receita for adicionada a produtos
	
	public Receitas(String autorEmail) {
		super();
        this.autorEmail = autorEmail;
    }
	
	public Receitas(long idReceitas, String nomeReceitas, String ingredientesReceitas, String modoDePreparoReceitas, double valorReceitas, String imgReceitas, String autorEmail) {
		super();
		this.idReceitas = idReceitas;
		this.nomeReceitas = nomeReceitas;
		this.ingredientesReceitas = ingredientesReceitas;
		this.modoDePreparoReceitas = modoDePreparoReceitas;
		this.valorReceitas = valorReceitas;
		this.imgReceitas = imgReceitas;
        this.autorEmail = autorEmail;
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
	public String getIngredientesReceitas() {return ingredientesReceitas;}
	public void setIngredientesReceitas(String ingredientesReceiatas) {
		this.ingredientesReceitas = ingredientesReceitas;
	}
	public String getModoDePreparoReceitas() {
		return modoDePreparoReceitas;
	}
	public void setModoDePreparoReceitas(String modoDePreparoReceitas) {this.modoDePreparoReceitas = modoDePreparoReceitas;}
	public String getAutorEmail() { return autorEmail; }
	public void setAutorEmail(String autorEmail) { this.autorEmail = autorEmail; }

	public String getAutorRole() { return autorRole; }
	public void setAutorRole(String autorRole) { this.autorRole = autorRole; }

	public boolean isParaProdutos() { return paraProdutos; }
	public void setParaProdutos(boolean paraProdutos) { this.paraProdutos = paraProdutos; }
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
