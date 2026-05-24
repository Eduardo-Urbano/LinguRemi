package LinguRemi.repository;

import java.util.List;

import LinguRemi.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByEmailUsuario(String emailUsuario);
}
