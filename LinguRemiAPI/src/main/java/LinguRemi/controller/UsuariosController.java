package LinguRemi.controller;

import java.util.List;
import java.util.Map;

import LinguRemi.DTO.*;
import LinguRemi.Enum.UserRole;
import LinguRemi.Infra.Security.LoginAttemptService;
import jakarta.servlet.http.HttpServletRequest;
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

import LinguRemi.Infra.Security.TokenService;
import LinguRemi.Infra.Exception.AccountLockedException;
import LinguRemi.model.Usuarios;
import LinguRemi.repository.UsuariosRepository;
import LinguRemi.service.RefreshTokenService;
import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;

@Tag(name = "Usuários", description = "Endpoints relacionados ao gerenciamento de usuários, autenticação, cadastro e listagem")
@RestController
@RequestMapping(value = "/usuarios")
public class UsuariosController {

	private static final Logger logger =
			LoggerFactory.getLogger(UsuariosController.class);

    private final PasswordEncoder passwordEncoder;

	@Autowired
	private UsuariosRepository repU;
	@Autowired
	private AuthenticationManager authM;
	@Autowired
	private TokenService tokenService;
	@Autowired
	private RefreshTokenService refreshTokenService;
	@Autowired
	private LoginAttemptService loginAttemptService;

    UsuariosController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
	
	@Operation(summary = "Realiza login do usuário e retorna token JWT")
	@PostMapping(value = "/login")
	public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AuthenticationDTO data, HttpServletRequest request) {

		String ip = request.getRemoteAddr();
		if (loginAttemptService.isBlocked(data.login())) {

			logger.warn(
					"[LOGIN BLOCKED] {} | IP: {}",
					data.login(),
					ip
			);

			throw new AccountLockedException(
					"Usuário temporariamente bloqueado. Tente novamente mais tarde."
			);
		}

		try {
			var usernamePassword =
					new UsernamePasswordAuthenticationToken(
							data.login(),
							data.password()
					);

			var auth = this.authM.authenticate(usernamePassword);

			var usuario = (Usuarios) auth.getPrincipal();

			loginAttemptService.registerSuccess(
					usuario.getEmailUsuarios()
			);

			var accessToken = tokenService.generateToken(usuario);
			var refreshToken = refreshTokenService.criarRefreshToken(usuario);

			logger.info(
					"[LOGIN SUCCESS] {} | IP: {}",
					usuario.getEmailUsuarios(),
					ip
			);

			return ResponseEntity.ok(
					new LoginResponseDTO(
							accessToken,
							refreshToken.getToken(),
							usuario.getNomeUsuarios(),
							usuario.getEmailUsuarios(),
							usuario.getRoleUsuarios().name()
					)
			);

		} catch (Exception e) {

			loginAttemptService.registerFailure(
					data.login()
			);

			logger.warn(
					"[LOGIN FAILED] {} | IP: {}",
					data.login(),
					ip
			);

			throw e;
		}
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
	public ResponseEntity<Map<String, String>> cadastrar(@RequestBody @Valid RegisterDTO data) {
		if (this.repU.findByEmailUsuarios(data.email()) != null) {
			return ResponseEntity.badRequest().body(
					Map.of(
							"message",
							"Email já cadastrado"
					)
			);
		}
		String encryptedPassword = passwordEncoder.encode(data.senha());
		Usuarios user = new Usuarios(data.nome(), data.email(), encryptedPassword, UserRole.USER);
		this.repU.save(user);
		logger.info(
				"Usuário cadastrado: {}",
				user.getEmailUsuarios()
		);
		return ResponseEntity.ok(Map.of("message", "Usuário cadastrado com sucesso"));
	}

	@PostMapping("/logout")
	public ResponseEntity<Map<String, String>> logout(
			@RequestBody RefreshTokenDTO dto
	){

		var refreshToken =
				refreshTokenService.validarRefreshToken(
						dto.refreshToken()
				);

		logger.info(
				"Logout realizado para {}",
				refreshToken.getUsuario().getEmailUsuarios()
		);

		refreshTokenService.revogarRefreshToken(
				dto.refreshToken()
		);

		return ResponseEntity.ok(
				Map.of(
						"message",
						"Logout realizado com sucesso"
				)
		);
	}

	@Operation(summary = "Lista todos os usuários cadastrados")
	@GetMapping("/todos")
	public List<UsuarioResponseDTO> users() {

		return repU.findAll()
				.stream()
				.map(usuario ->
						new UsuarioResponseDTO(
								usuario.getIdUsuarios(),
								usuario.getNomeUsuarios(),
								usuario.getEmailUsuarios(),
								usuario.getRoleUsuarios().name()
						)
				)
				.toList();
	}
}
