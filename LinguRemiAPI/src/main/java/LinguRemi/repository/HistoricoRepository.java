package LinguRemi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import LinguRemi.model.Historico;

public interface HistoricoRepository extends JpaRepository<Historico, Long>{
	List<Historico> findAll();
}
