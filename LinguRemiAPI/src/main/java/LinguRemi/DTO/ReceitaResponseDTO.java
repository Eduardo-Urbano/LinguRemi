package LinguRemi.DTO;

public record ReceitaResponseDTO(
        Long id,
        String nome,
        String descricao,
        Double valor,
        String img,
        Double avaliacao,
        Integer disponivel,
        String tipoQuantidade
) {}
