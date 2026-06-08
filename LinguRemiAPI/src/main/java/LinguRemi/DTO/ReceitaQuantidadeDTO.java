package LinguRemi.DTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ReceitaQuantidadeDTO {

	@NotNull(message = "Receita é obrigatória")
	private Long id;

	@NotNull(message = "Quantidade é obrigatória")
	@Positive(message = "Quantidade deve ser maior que zero")
	private Double quantidade;
	
	public ReceitaQuantidadeDTO() {
		super();
	}
	
	public ReceitaQuantidadeDTO(Long id, Double quantidade) {
		super();
		this.id = id;
		this.quantidade = quantidade;
	}
	
	public Long getId() {

		return id;
	}
	public void setId(Long id) {

		this.id = id;
	}
	public Double getQuantidade() {

		return quantidade;
	}
	public void setQuantidade(Double quantidade) {

		this.quantidade = quantidade;
	}
}