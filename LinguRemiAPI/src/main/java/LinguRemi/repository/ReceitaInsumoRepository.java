package LinguRemi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import LinguRemi.model.ReceitaInsumo;

public interface ReceitaInsumoRepository extends JpaRepository<ReceitaInsumo, Long> {
    List<ReceitaInsumo> findByReceitaIdReceitas(Long idReceitas);
}