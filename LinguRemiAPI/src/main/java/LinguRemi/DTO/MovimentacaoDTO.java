package LinguRemi.DTO;

public record MovimentacaoDTO(
    Double quantidade,
    String tipoMovimentacao, 
    String motivo
) {}