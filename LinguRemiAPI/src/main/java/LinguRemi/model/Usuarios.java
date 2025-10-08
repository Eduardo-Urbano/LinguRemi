package LinguRemi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Usuarios")
public class Usuarios {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long idUsuarios;
	private String nomeUsuarios;
	private String emailUsuarios;	
	private String senhaUsuarios;	
	private String telefoneUsuarios;
	
	
	public Usuarios() {
		super();
	}
	public Usuarios(long idUsuarios, String nomeUsuarios, String emailUsuario, String senhaUsuario,
			String telefoneUsuario) {
		super();
		this.idUsuarios = idUsuarios;
		this.nomeUsuarios = nomeUsuarios;
		this.emailUsuarios = emailUsuario;
		this.senhaUsuarios = senhaUsuario;
		this.telefoneUsuarios = telefoneUsuario;
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
	public String getTelefoneUsuario() {
		return telefoneUsuarios;
	}
	public void setTelefoneUsuario(String telefoneUsuario) {
		this.telefoneUsuarios = telefoneUsuario;
	}
	
}
