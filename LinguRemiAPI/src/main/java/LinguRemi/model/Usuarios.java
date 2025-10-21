package LinguRemi.model;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import LinguRemi.Enum.UserRole;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Usuarios")
public class Usuarios implements UserDetails{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long idUsuarios;
	private String nomeUsuarios;
	private String emailUsuarios;	
	private String senhaUsuarios;
	private UserRole roleUsuarios;
	
	public Usuarios(String nomeUsuarios, String emailUsuarios, String senhaUsuario,
			UserRole roleUsuarios) {
		super();
		this.nomeUsuarios = nomeUsuarios;
		this.emailUsuarios = emailUsuarios;
		this.senhaUsuarios = senhaUsuario;
		this.roleUsuarios = roleUsuarios;
	}
	
	public Usuarios(long idUsuarios, String nomeUsuarios, String emailUsuarios, String senhaUsuarios,
			UserRole roleUsuarios) {
		super();
		this.idUsuarios = idUsuarios;
		this.nomeUsuarios = nomeUsuarios;
		this.emailUsuarios = emailUsuarios;
		this.senhaUsuarios = senhaUsuarios;
		this.roleUsuarios = roleUsuarios;
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
	public String getEmailUsuario() {
		return emailUsuarios;
	}
	public void setEmailUsuario(String emailUsuario) {
		this.emailUsuarios = emailUsuario;
	}
	public String getSenhaUsuario() {
		return senhaUsuarios;
	}
	public void setSenhaUsuario(String senhaUsuario) {
		this.senhaUsuarios = senhaUsuario;
	}
	public UserRole getRoleUsuarios() {
		return roleUsuarios;
	}
	public void setRoleUsuarios(UserRole roleUsuarios) {
		this.roleUsuarios = roleUsuarios;
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
}
