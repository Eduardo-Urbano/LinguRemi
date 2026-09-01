package LinguRemi.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import LinguRemi.model.MovimentacaoEstoque;

public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, Long> {
    List<MovimentacaoEstoque> findByInsumoIdInsumoOrderByDataMovimentacaoDesc(Long idInsumo);
    List<MovimentacaoEstoque> findByTipoMovimentacaoAndDataMovimentacaoBetween(
        String tipoMovimentacao, LocalDateTime inicio, LocalDateTime fim);
}