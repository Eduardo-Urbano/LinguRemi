package LinguRemi.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import LinguRemi.model.Receitas;

public interface ReceitasRepository extends JpaRepository<Receitas, Long>{
	List<Receitas> findAll();
	Optional<Receitas> findByIdReceitas(Long id);
}
