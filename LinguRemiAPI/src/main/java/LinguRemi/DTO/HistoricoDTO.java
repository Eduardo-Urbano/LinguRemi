package LinguRemi.DTO;

import java.util.List;

public class HistoricoDTO {
	private String emailTransferencia;
    private double valorTransferencia;
    private String descTransferencia;
    private List<ReceitaQuantidadeDTO> receitasTransferencia;
	
	public HistoricoDTO() {
		super();
	}
	
	public HistoricoDTO(String emailTransferencia, double valorTransferencia, String descTransferencia,
			List<ReceitaQuantidadeDTO> receitasTransferencia) {
		super();
		this.emailTransferencia = emailTransferencia;
		this.valorTransferencia = valorTransferencia;
		this.descTransferencia = descTransferencia;
		this.receitasTransferencia = receitasTransferencia;
	}

	public String getEmailTransferencia() {
		return emailTransferencia;
	}

	public void setEmailTransferencia(String emailTransferencia) {
		this.emailTransferencia = emailTransferencia;
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
