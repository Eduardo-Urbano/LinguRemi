package LinguRemi.Infra.Security;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import LinguRemi.model.Usuarios;
import LinguRemi.repository.UsuariosRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class SecurityFilter extends OncePerRequestFilter{

	@Autowired
	TokenService tokenService;
	@Autowired
	UsuariosRepository repU;

	private static final Logger logger =
			LoggerFactory.getLogger(SecurityFilter.class);
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		logger.info(
				"[REQUEST] {} {}",
				request.getMethod(),
				request.getRequestURI()
		);

		try {

			var token = recoverToken(request);

			if (token != null) {

				var login = tokenService.validateToken(token);

				if (login != null && !login.isBlank()) {

					UserDetails ud = repU.findByEmailUsuarios(login);
					Usuarios usuario = (Usuarios) ud;

					if (usuario != null) {

						var authentication =
								new UsernamePasswordAuthenticationToken(
										usuario,
										null,
										usuario.getAuthorities()
								);

						SecurityContextHolder
								.getContext()
								.setAuthentication(authentication);
					}
				}
			}

		} catch (Exception e) {

			logger.warn(
					"[JWT INVALIDO] {}",
					e.getMessage()
			);
		}
		filterChain.doFilter(request,response);
		logger.info(
				"[RESPONSE] {} {} -> {}",
				request.getMethod(),
				request.getRequestURI(),
				response.getStatus()
		);
	}
	
	private String recoverToken(HttpServletRequest request) {
		var authHeader = request.getHeader("Authorization");

		if(authHeader == null || !authHeader.startsWith("Bearer ")){
			return null;
		}

		return authHeader.replace("Bearer ", "");
	}
}
