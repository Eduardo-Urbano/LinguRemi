package LinguRemi.model;

import LinguRemi.Enum.UserRole;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "Usuarios")
public class Usuarios implements UserDetails{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long idUsuarios;

	@Column(nullable = false)
	private String nomeUsuarios;

	@Column(unique = true, nullable = false)
	private String emailUsuarios;

	@Column(nullable = false)
	@JsonIgnore
	private String senhaUsuarios;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private UserRole roleUsuarios;
	
	@Column(nullable = false)
	private boolean ativoUsuarios;
	
	public Usuarios(String nomeUsuarios, String emailUsuarios, String senhaUsuario,
			UserRole roleUsuarios, boolean ativoUsuarios) {
		super();
		this.nomeUsuarios = nomeUsuarios;
		this.emailUsuarios = emailUsuarios;
		this.senhaUsuarios = senhaUsuario;
		this.roleUsuarios = roleUsuarios;
		this.ativoUsuarios = ativoUsuarios;
	}
	
	public Usuarios(long idUsuarios, String nomeUsuarios, String emailUsuarios, String senhaUsuarios,
			UserRole roleUsuarios, boolean ativoUsuarios) {
		super();
		this.idUsuarios = idUsuarios;
		this.nomeUsuarios = nomeUsuarios;
		this.emailUsuarios = emailUsuarios;
		this.senhaUsuarios = senhaUsuarios;
		this.roleUsuarios = roleUsuarios;
		this.ativoUsuarios = ativoUsuarios;
	}

	public Usuarios() {
		super();
	}

	
	public long getIdUsuarios() {
		return idUsuarios;
	}
	public void setIdUsuarios(long idUsuarios) {
		this.idUsuarios = idUsuarios;
	}
	public String getNomeUsuarios() {
		return nomeUsuarios;
	}
	public void setNomeUsuarios(String nomeUsuarios) {
		this.nomeUsuarios = nomeUsuarios;
	}
	public String getEmailUsuarios() {
		return emailUsuarios;
	}
	public void setEmailUsuarios(String emailUsuario) {
		this.emailUsuarios = emailUsuario;
	}
	public String getSenhaUsuarios() {
		return senhaUsuarios;
	}
	public void setSenhaUsuarios(String senhaUsuario) {
		this.senhaUsuarios = senhaUsuario;
	}
	public UserRole getRoleUsuarios() {
		return roleUsuarios;
	}
	public void setRoleUsuarios(UserRole roleUsuarios) {
		this.roleUsuarios = roleUsuarios;
	}
	
	public boolean isAtivoUsuarios() {
		return ativoUsuarios;
	}
	public void setAtivoUsuarios(boolean ativoUsuarios) {
		this.ativoUsuarios = ativoUsuarios;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		if(this.roleUsuarios == UserRole.ADMIN) return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
		else return List.of(new SimpleGrantedAuthority("ROLE_USER"));
	}
	
	@JsonIgnore
	@Override
	public String getPassword() {
		return senhaUsuarios;
	}
	
	@JsonIgnore
	@Override
	public String getUsername() {
		return emailUsuarios;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
	
}
