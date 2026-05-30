package LinguRemi.controller;

import java.util.List;
import java.util.Map;

import LinguRemi.Enum.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
import LinguRemi.DTO.RefreshTokenDTO;
import LinguRemi.service.RefreshTokenService;
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
	@Autowired
	private RefreshTokenService refreshTokenService;

    UsuariosController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
	
	@Operation(summary = "Realiza login do usuário e retorna token JWT")
	@PostMapping(value = "/login")
	public ResponseEntity login(@RequestBody @Valid AuthenticationDTO data) {
		var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.password());
		var auth = this.authM.authenticate(usernamePassword);

		var usuario = (Usuarios) auth.getPrincipal();

		var accessToken = tokenService.generateToken(usuario);
		var refreshToken = refreshTokenService.criarRefreshToken(usuario);

		return ResponseEntity.ok(
				new LoginResponseDTO(
						accessToken,
						refreshToken.getToken(),
						usuario.getNomeUsuarios(),
						usuario.getEmailUsuarios(),
						usuario.getRoleUsuarios().name()
				)
		);
	}

	@PostMapping("/refresh")
	public ResponseEntity refresh(@RequestBody RefreshTokenDTO dto) {
		var refreshToken = refreshTokenService.validarRefreshToken(dto.refreshToken());
		var usuario = refreshToken.getUsuario();

		var novoAccessToken = tokenService.generateToken(usuario);

		return ResponseEntity.ok(Map.of("accessToken", novoAccessToken));
	}
	
	@Operation(summary = "Cadastra um novo usuário no sistema")
	@PostMapping(value = "/cadastrar")
	public ResponseEntity cadastrar(@RequestBody @Valid RegisterDTO data) {
		if(this.repU.findByEmailUsuarios(data.email()) != null) return ResponseEntity.badRequest().build();
		String encryptedPassword = passwordEncoder.encode(data.senha());
		Usuarios user = new Usuarios(data.nome(), data.email(), encryptedPassword, UserRole.USER);
		this.repU.save(user);
		//return ResponseEntity.ok().build();
		return ResponseEntity.ok(Map.of("message", "Usuário cadastrado com sucesso"));
	}

	@PostMapping("/logout")
	public ResponseEntity<?> logout(@RequestBody RefreshTokenDTO dto){
		refreshTokenService.revogarRefreshToken(dto.refreshToken());

		return ResponseEntity.ok(Map.of("message","Logout realizado com sucesso"));
	}

	@Operation(summary = "Lista todos os usuários cadastrados")
	@GetMapping(value = "/todos")
	public List<Usuarios> users() {
		List<Usuarios> op = repU.findAll();
		return op;
	}

	@PutMapping("/resetPassword")
	public ResponseEntity resetPassword(@RequestBody ResetPasswordDTO dto){
		
	}
}
