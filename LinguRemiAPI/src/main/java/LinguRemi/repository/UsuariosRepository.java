package LinguRemi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import LinguRemi.model.Usuarios;

public interface UsuariosRepository extends JpaRepository<Usuarios, Long>{
	List<Usuarios> findAll();
}
