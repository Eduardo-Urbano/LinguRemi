package LinguRemi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import LinguRemi.model.Usuarios;

public interface UsuariosRepository extends JpaRepository<Usuarios, Long>{
	UserDetails findByEmailUsuarios(String emailUsuarios);
	List<Usuarios> findAll();
}
