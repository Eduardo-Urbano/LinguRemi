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
						.requestMatchers(HttpMethod.POST, "/receitas/**").permitAll()
						.requestMatchers(HttpMethod.GET, "/receitas/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/historico/**").permitAll()
						.requestMatchers(HttpMethod.GET, "/historico/**").permitAll()
						.requestMatchers("/uploads/**").permitAll()
						.requestMatchers("/h2-console/**").permitAll()
						.anyRequest().authenticated()
				)
				.headers(headers -> headers.frameOptions(frame -> frame.disable()))
				//.addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowCredentials(true);
		configuration.addAllowedOriginPattern("http://127.0.0.1:5500");
		configuration.addAllowedOriginPattern("http://localhost:5500");
		configuration.addAllowedHeader("*");
		configuration.addAllowedMethod("GET");
		configuration.addAllowedMethod("POST");
		configuration.addAllowedMethod("PUT");
		configuration.addAllowedMethod("DELETE");
		configuration.addAllowedMethod("OPTIONS");

		configuration.addAllowedHeader("Authorization");  // Permite cabeçalho Authorization
	    configuration.addAllowedHeader("*");  // Permite todos os cabeçalhos (caso haja mais cabeçalhos personalizados)
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
