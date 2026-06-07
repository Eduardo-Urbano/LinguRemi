package LinguRemi.DTO;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;

public class CadastroDTO {
	
	@NotBlank(message = "De um nome a receita")
	private String nomeReceita;
	@NotBlank(message = "Insira ao menos um ingrediente!")
	private String ingReceita;
	@NotBlank(message = "Insira o modo de preparo")
	private String preparoReceita;
	@NotBlank(message = "Insira uma breve descrição a receita")
	private String descReceita;
	@NotBlank(message = "Insira o tempo de preparo")
	private String tempoReceita;
	
	
	private MultipartFile imgReceita;

	
	public CadastroDTO() {
		super();
	}

	public CadastroDTO(String nomeReceita,String ingReceita, String preparoReceita, String descReceita,String tempoReceita, MultipartFile imgReceita) {
		super();
		this.nomeReceita = nomeReceita;
		this.ingReceita = ingReceita;
		this.preparoReceita = preparoReceita;
		this.descReceita = descReceita;
		this.tempoReceita = tempoReceita;
		this.imgReceita = imgReceita;
	}

	public String getNomeReceita() {
		return nomeReceita;
	}
	public void setNomeReceita(String nomeReceita) {
		this.nomeReceita = nomeReceita;
	}

	public String getIngReceita() {
		return ingReceita;
	}
	public void setIngReceita(String ingReceita) {
		this.ingReceita = ingReceita;
	}

	public String getPreparoReceita() {
		return preparoReceita;
	}
	public void setPreparoReceita(String preparoReceita) {
		this.preparoReceita = preparoReceita;
	}

	public String getDescReceita() {
		return descReceita;
	}
	public void setDescReceita(String descReceita) {
		this.descReceita = descReceita;
	}

	public MultipartFile getImgReceita() {
		return imgReceita;
	}
	public void setImgReceita(MultipartFile imgReceita) {
		this.imgReceita = imgReceita;
	}
	
	public String getTempoReceita() {
		return tempoReceita;
	}

	public void setTempoReceita(String tempoReceita) {
		this.tempoReceita = tempoReceita;
	}

	
}
