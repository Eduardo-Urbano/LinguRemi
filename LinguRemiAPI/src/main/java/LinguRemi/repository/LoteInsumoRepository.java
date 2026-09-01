package LinguRemi.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import LinguRemi.model.LoteInsumo;

public interface LoteInsumoRepository extends JpaRepository<LoteInsumo, Long> {
    List<LoteInsumo> findByInsumoIdInsumoAndQuantidadeAtualGreaterThanOrderByDataValidadeAsc(Long idInsumo, Double zero);
    List<LoteInsumo> findByDataValidadeBetweenAndQuantidadeAtualGreaterThan(LocalDate inicio, LocalDate fim, Double zero);
}