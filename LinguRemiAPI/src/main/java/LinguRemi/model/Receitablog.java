package LinguRemi.model;

import java.time.ZonedDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Receitablog")
public class Receitablog {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long idReceitaBlog;
	private String nomeReceitablog;
	private String descricaoReceitablog;
	private String preparoReceitaBlog;
	private String imgReceitablog;
	private String ingredientesReceitablog;
	private ZonedDateTime dataReceitablog;
	private String tempoReceitablog;
	
	public Receitablog() {
		super();
	}

	public Receitablog(String nomeReceitablog, String descricaoReceitablog, String preparoReceitaBlog, String imgReceitablog,
			String ingredientesReceitablog, ZonedDateTime dataReceitablog, String tempoReceitablog) {
		super();
		this.nomeReceitablog = nomeReceitablog;
		this.descricaoReceitablog = descricaoReceitablog;
		this.preparoReceitaBlog = preparoReceitaBlog;
		this.imgReceitablog = imgReceitablog;
		this.ingredientesReceitablog = ingredientesReceitablog;
		this.dataReceitablog = dataReceitablog;
		this.tempoReceitablog = tempoReceitablog;
	}

	public long getIdReceitaBlog() {
		return idReceitaBlog;
	}

	public void setIdReceitaBlog(long idReceitaBlog) {
		this.idReceitaBlog = idReceitaBlog;
	}

	public String getNomeReceitablog() {
		return nomeReceitablog;
	}

	public void setNomeReceitablog(String nomeReceitablog) {
		this.nomeReceitablog = nomeReceitablog;
	}

	public String getDescricaoReceitablog() {
		return descricaoReceitablog;
	}

	public void setDescricaoReceitablog(String descricaoReceitablog) {
		this.descricaoReceitablog = descricaoReceitablog;
	}

	public String getPreparoReceitaBlog(){return preparoReceitaBlog;}

	public void setPreparoReceitaBlog(String preparoReceitaBlog){this.preparoReceitaBlog = preparoReceitaBlog;}

	public String getImgReceitablog() {
		return imgReceitablog;
	}

	public void setImgReceitablog(String imgReceitablog) {
		this.imgReceitablog = imgReceitablog;
	}

	public String getIngredientesReceitablog() {
		return ingredientesReceitablog;
	}

	public void setIngredientesReceitablog(String ingredientesReceitablog) {
		this.ingredientesReceitablog = ingredientesReceitablog;
	}

	public ZonedDateTime getDataReceitablog() {
		return dataReceitablog;
	}

	public void setDataReceitablog(ZonedDateTime dataReceitablog) {
		this.dataReceitablog = dataReceitablog;
	}

	public String getTempoReceitablog() {
		return tempoReceitablog;
	}

	public void setTempoReceitablog(String tempoReceitablog) {
		this.tempoReceitablog = tempoReceitablog;
	}


	
}
