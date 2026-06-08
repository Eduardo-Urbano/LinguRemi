package LinguRemi.DTO;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;

public class HistoricoDTO {
	@NotBlank(message = "Descrição é obrigatória")
	private String descTransferencia;

	@Positive(message = "Valor deve ser maior que zero")
	private double valorTransferencia;

	@NotEmpty(message = "O histórico deve conter pelo menos uma receita")
	private List<@Valid ReceitaQuantidadeDTO> receitasTransferencia;
	
	public HistoricoDTO() {
		super();
	}
	
	public HistoricoDTO(String emailTransferencia, double valorTransferencia, String descTransferencia,
			List<ReceitaQuantidadeDTO> receitasTransferencia) {
		super();
		this.valorTransferencia = valorTransferencia;
		this.descTransferencia = descTransferencia;
		this.receitasTransferencia = receitasTransferencia;
	}

	public double getValorTransferencia() {
		return valorTransferencia;
	}

	public void setValorTransferencia(double valorTransferencia) {
		this.valorTransferencia = valorTransferencia;
	}

	public String getDescTransferencia() {
		return descTransferencia;
	}

	public void setDescTransferencia(String descTransferencia) {
		this.descTransferencia = descTransferencia;
	}

	public List<ReceitaQuantidadeDTO> getReceitasTransferencia() {
		return receitasTransferencia;
	}

	public void setReceitasTransferencia(List<ReceitaQuantidadeDTO> receitasTransferencia) {
		this.receitasTransferencia = receitasTransferencia;
	}
}