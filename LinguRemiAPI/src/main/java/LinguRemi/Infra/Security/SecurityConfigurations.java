package LinguRemi.Infra.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {
	
	@Autowired
	SecurityFilter securityFilter;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
		return httpSecurity
				.csrf(csrf -> csrf.disable())
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				//aqui defini o que só pode ser aberto por cada usuario
				.authorizeHttpRequests(authorize -> authorize
						.requestMatchers(HttpMethod.GET, "/usuarios/todos").permitAll()
						.requestMatchers(HttpMethod.POST, "/usuarios/login").permitAll()
						.requestMatchers(HttpMethod.POST, "/usuarios/cadastrar").permitAll()
						.requestMatchers(HttpMethod.POST, "/usuarios/refresh").permitAll()
						.requestMatchers(HttpMethod.POST, "/usuarios/logout").permitAll()
						.requestMatchers("/", "/health").permitAll()
						.requestMatchers("/swagger-ui/**","/swagger-ui.html","/v3/api-docs/**","/v3/api-docs","/swagger-resources/**","/webjars/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/receitas/**").hasAnyRole("USER", "ADMIN")
						.requestMatchers(HttpMethod.GET, "/receitas/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/checkout/**").hasAnyRole("USER", "ADMIN")
						.requestMatchers(HttpMethod.GET, "/checkout/**").hasAnyRole("USER", "ADMIN")
						.requestMatchers(HttpMethod.POST, "/historico/**").hasAnyRole("USER", "ADMIN")
						.requestMatchers(HttpMethod.GET, "/historico/**").hasAnyRole("USER", "ADMIN")
						.requestMatchers(HttpMethod.PUT, "/admin/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.POST, "/admin/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.GET, "/admin/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.DELETE, "/admin/**").hasRole("ADMIN")
						.requestMatchers("/uploads/**").permitAll()
						.requestMatchers("/h2-console/**").permitAll()
						.anyRequest().authenticated()
				)
				.headers(headers -> headers.frameOptions(frame -> frame.disable()))
				.addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();

		configuration.setAllowCredentials(true);
		configuration.addAllowedOriginPattern("*");
		configuration.addAllowedHeader("*");
		configuration.addAllowedMethod("*");

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);

		return source;
	}
	
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
