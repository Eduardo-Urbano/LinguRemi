package LinguRemi.DTO;

import org.springframework.web.multipart.MultipartFile;

public class ProdutoUploadDTO {
	private String nome;
    private String descricao;
    private Double valor;
    private Double disponivel;
    private String tipoQuantidade;
    private MultipartFile imagem;
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getDescricao() {
		return descricao;
	}
	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}
	public Double getValor() {
		return valor;
	}
	public void setValor(Double valor) {
		this.valor = valor;
	}
	public Double getDisponivel() {
		return disponivel;
	}
	public void setDisponivel(Double disponivel) {
		this.disponivel = disponivel;
	}
	public String getTipoQuantidade() {
		return tipoQuantidade;
	}
	public void setTipoQuantidade(String tipoQuantidade) {
		this.tipoQuantidade = tipoQuantidade;
	}
	public MultipartFile getImagem() {
		return imagem;
	}
	public void setImagem(MultipartFile imagem) {
		this.imagem = imagem;
	}
    
    
}
