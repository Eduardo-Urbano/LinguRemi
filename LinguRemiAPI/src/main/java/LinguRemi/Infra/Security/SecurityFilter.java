package LinguRemi.Infra.Security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import LinguRemi.repository.UsuariosRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

		var token = this.recoverToken(request);

		if(token != null) {
			var login = tokenService.validateToken(token);

			if (login != null && !login.isBlank()){
				UserDetails usuarios = repU.findByEmailUsuarios(login);

				if (usuarios != null){
					var authentication = new UsernamePasswordAuthenticationToken(
							usuarios,
							null,
							usuarios.getAuthorities()
					);

					SecurityContextHolder.getContext().setAuthentication(authentication);
				}
			}
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
