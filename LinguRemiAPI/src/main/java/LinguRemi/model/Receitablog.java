package LinguRemi.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.time.ZonedDateTime;

@Entity
@Table(name = "Receitablog")
public class Receitablog {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long idReceitaBlog;

	@Column(nullable = false)
	private String nomeReceitablog;

	@Column(nullable = false)
	private String descricaoReceitablog;

	private String imgReceitablog;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String ingredientesReceitablog;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String preparoReceitaBlog;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
	@Column(nullable = false)
	private ZonedDateTime dataReceitablog;

	@Column(nullable = false)
	private String tempoReceitablog;
		
	public Receitablog(long idReceitaBlog, String nomeReceitablog, String descricaoReceitablog, String imgReceitablog,
			String ingredientesReceitablog,String preparoReceitaBlog ,ZonedDateTime dataReceitablog) {
		super();
		this.idReceitaBlog = idReceitaBlog;
		this.nomeReceitablog = nomeReceitablog;
		this.descricaoReceitablog = descricaoReceitablog;
		this.imgReceitablog = imgReceitablog;
		this.ingredientesReceitablog = ingredientesReceitablog;
		this.preparoReceitaBlog = preparoReceitaBlog;
		this.dataReceitablog = dataReceitablog;
	}

	public Receitablog() {
		super();
	}

	public Receitablog(String nomeReceitablog, String descricaoReceitablog, String imgReceitablog,
			String ingredientesReceitablog,String preparoReceitaBlog ,ZonedDateTime dataReceitablog, String tempoReceitablog) {
		super();
		this.nomeReceitablog = nomeReceitablog;
		this.descricaoReceitablog = descricaoReceitablog;
		this.imgReceitablog = imgReceitablog;
		this.ingredientesReceitablog = ingredientesReceitablog;
		this.dataReceitablog = dataReceitablog;
		this.preparoReceitaBlog = preparoReceitaBlog;
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

	public String getPreparoReceitaBlog() {
		return preparoReceitaBlog;
	}

	public void setPreparoReceitaBlog(String preparoReceitaBlog) {
		this.preparoReceitaBlog = preparoReceitaBlog;
	}
	
}
