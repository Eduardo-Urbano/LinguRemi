package LinguRemi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import LinguRemi.model.Receitablog;

public interface ReceitaBlogRepository extends JpaRepository<Receitablog, Long>{
	List<Receitablog> findAll();
}
