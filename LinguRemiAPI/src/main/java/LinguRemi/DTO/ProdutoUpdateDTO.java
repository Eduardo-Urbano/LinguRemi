package LinguRemi.DTO;

public record ProdutoUpdateDTO(
        String nomeReceitas,
        String descReceitas,
        Double valorReceitas,
        Double avaliacaoReceitas,
        Double disponivelReceitas,
        String tipoquantidadeReceitas
) {}