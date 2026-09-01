package LinguRemi.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import LinguRemi.model.Insumo;

public interface InsumoRepository extends JpaRepository<Insumo, Long> {
    List<Insumo> findByAtivoInsumoTrue();
    List<Insumo> findByEstoqueAtualLessThanEqualAndAtivoInsumoTrue(Double estoqueMinimo);
}