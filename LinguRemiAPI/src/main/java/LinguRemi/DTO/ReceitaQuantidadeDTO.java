package LinguRemi.DTO;

public class ReceitaQuantidadeDTO {
	private Long id;
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
