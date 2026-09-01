package LinguRemi.DTO;

public record InsumoDTO(
    String nomeInsumo,
    String unidadeMedida,
    Double estoqueMinimo,
    Double custoUnitario
) {}