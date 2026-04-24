package br.unesp.backend.model;

import br.unesp.backend.model.enums.UserRole;
import jakarta.persistence.*;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
public class Usuario implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private String login;
    private String senha;
    private String telefone;
    private Boolean isAtivo;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role")
    private UserRole userRole;

    public Usuario() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public Boolean getAtivo() {
        return isAtivo;
    }

    public void setAtivo(Boolean ativo) {
        isAtivo = ativo;
    }

    public UserRole getUserRole() {
        return userRole;
    }

    public void setUserRole(UserRole tipoUsuario) {
        this.userRole = tipoUsuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.userRole == UserRole.ADMIN) {
            return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"),
                    new SimpleGrantedAuthority("ROLE_ORGANIZADOR"),
                    new SimpleGrantedAuthority("ROLE_PARTICIPANTE"));
        } else if (this.userRole == UserRole.ORGANIZADOR) {
            return List.of(new SimpleGrantedAuthority("ROLE_ORGANIZADOR"),
                    new SimpleGrantedAuthority("ROLE_PARTICIPANTE"));
        } else {
            return List.of(new SimpleGrantedAuthority("ROLE_PARTICIPANTE"));
        }
    }

    @Override
    public @Nullable String getPassword() {
        return this.getSenha();
    }

    @Override
    public String getUsername() {
        return this.getLogin();
    }
}