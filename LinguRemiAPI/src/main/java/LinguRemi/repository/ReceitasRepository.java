package LinguRemi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import LinguRemi.model.Receitas;
import jakarta.persistence.LockModeType;

public interface ReceitasRepository extends JpaRepository<Receitas, Long> {

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT r FROM Receitas r WHERE r.idReceitas = :id")
	Receitas findByIdForUpdate(@Param("id") Long id);
	
	List<Receitas> findByAtivoReceitasTrue();
}