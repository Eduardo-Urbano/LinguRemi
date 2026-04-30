package LinguRemi.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import LinguRemi.DTO.AuthenticationDTO;
import LinguRemi.DTO.LoginResponseDTO;
import LinguRemi.DTO.RegisterDTO;
import LinguRemi.Infra.Security.TokenService;
import LinguRemi.model.Usuarios;
import LinguRemi.repository.UsuariosRepository;
import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;

@Tag(name = "Usuários", description = "Endpoints relacionados ao gerenciamento de usuários, autenticação, cadastro e listagem")
@RestController
@RequestMapping(value = "/usuarios")
public class UsuariosController {

    private final PasswordEncoder passwordEncoder;

	@Autowired
	private UsuariosRepository repU;
	@Autowired
	private AuthenticationManager authM;
	@Autowired
	private TokenService tokenService;

    UsuariosController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
	
	@Operation(summary = "Realiza login do usuário e retorna token JWT")
	@PostMapping(value = "/login")
	public ResponseEntity login(@RequestBody @Valid AuthenticationDTO data) {
		var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(),data.password());
		var auth = this.authM.authenticate(usernamePassword);
		var usuario = (Usuarios) auth.getPrincipal();
		var token = tokenService.generateToken((Usuarios)auth.getPrincipal());
		
		
		
		return ResponseEntity.ok(new LoginResponseDTO(token, usuario.getNomeUsuarios(), usuario.getEmailUsuarios()));
	}
	
	@Operation(summary = "Cadastra um novo usuário no sistema")
	@PostMapping(value = "/cadastrar")
	public ResponseEntity cadastrar(@RequestBody @Valid RegisterDTO data) {
		if(this.repU.findByEmailUsuarios(data.email()) != null) return ResponseEntity.badRequest().build();
		String encryptedPassword = new BCryptPasswordEncoder().encode(data.senha());
		Usuarios user = new Usuarios(data.nome(), data.email(), encryptedPassword, data.role());
		this.repU.save(user);
		//return ResponseEntity.ok().build();
		return ResponseEntity.ok(Map.of("message", "Usuário cadastrado com sucesso"));
	}

	@Operation(summary = "Lista todos os usuários cadastrados")
	@GetMapping(value = "/todos")
	public List<Usuarios> users() {
		List<Usuarios> op = repU.findAll();
		return op;
	}
}
