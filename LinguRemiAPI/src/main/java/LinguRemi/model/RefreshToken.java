package LinguRemi.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    private Instant expiresAt;

    private boolean revoked = false;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuarios usuario;

    public RefreshToken() {
    }

    public RefreshToken(String token, Instant expiresAt, Usuarios usuario) {
        this.token = token;
        this.expiresAt = expiresAt;
        this.usuario = usuario;
    }

    public Long getId() {
        return id;
    }

    public String getToken() {
        return token;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public boolean isRevoked() {
        return revoked;
    }

    public Usuarios getUsuario() {
        return usuario;
    }

    public void setRevoked(boolean revoked) {
        this.revoked = revoked;
    }
}
