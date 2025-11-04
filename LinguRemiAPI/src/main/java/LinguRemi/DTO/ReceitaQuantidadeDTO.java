package LinguRemi.DTO;

public class ReceitaQuantidadeDTO {
	private Long id;
	private double quantidade;
	
	public ReceitaQuantidadeDTO() {
		super();
	}
	
	public ReceitaQuantidadeDTO(Long id, double quantidade) {
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
	public double getQuantidade() {
		return quantidade;
	}
	public void setQuantidade(double quantidade) {
		this.quantidade = quantidade;
	}
	
	
}
