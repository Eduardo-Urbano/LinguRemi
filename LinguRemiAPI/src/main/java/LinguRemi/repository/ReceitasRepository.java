package LinguRemi.repository;

import LinguRemi.model.Receitas;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReceitasRepository extends JpaRepository<Receitas, Long> {

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT r FROM Receitas r WHERE r.idReceitas = :id")
	Receitas findByIdForUpdate(@Param("id") Long id);
}