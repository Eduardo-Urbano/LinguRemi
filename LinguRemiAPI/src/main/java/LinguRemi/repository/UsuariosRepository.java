package LinguRemi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import LinguRemi.model.Usuarios;

public interface UsuariosRepository extends JpaRepository<Usuarios, Long> {

	Optional<Usuarios> findByEmailUsuarios(String emailUsuarios);

}