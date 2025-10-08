package LinguRemi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import LinguRemi.model.Usuarios;
import LinguRemi.repository.UsuariosRepository;

@RestController
@RequestMapping(value = "/usuarios")
public class UsuariosController {

	@Autowired
	private UsuariosRepository repU;
	
	@GetMapping(value = "/todos")
	public List<Usuarios> listarTodos(){
		return repU.findAll();
	}
}
