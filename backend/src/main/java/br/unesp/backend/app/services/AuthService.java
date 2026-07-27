package br.unesp.backend.app.services;

import br.unesp.backend.app.dtos.auth.*;
import br.unesp.backend.app.dtos.usuario.UsuarioDTO;
import br.unesp.backend.infra.security.JwtTokenProvider;
import br.unesp.backend.model.entities.Usuario;
import br.unesp.backend.model.enums.UserRole;
import br.unesp.backend.model.repositories.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UsuarioRepository usuarioRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public LoginResponse registrar(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(request.nome());
        usuario.setEmail(request.email());
        usuario.setSenha(passwordEncoder.encode(request.senha()));
        usuario.setTelefone(request.telefone());
        usuario.setUserRole(UserRole.PARTICIPANTE);
        usuario.setIsAtivo(Boolean.TRUE);

        usuario = usuarioRepository.save(usuario);

        String token = tokenProvider.generateToken(usuario.getId(), usuario.getUserRole().name());
        return new LoginResponse(token, UsuarioDTO.fromEntity(usuario));
    }

    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos"));

        if (!passwordEncoder.matches(request.senha(), usuario.getSenha())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos");
        }

        if (!Boolean.TRUE.equals(usuario.getIsAtivo())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuário desativado. Contate o administrador.");
        }

        String token = tokenProvider.generateToken(usuario.getId(), usuario.getUserRole().name());
        return new LoginResponse(token, UsuarioDTO.fromEntity(usuario));
    }

    public LoginResponse loginDemo(DemoRequest request) {
        Usuario usuario = usuarioRepository.findById(request.usuarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        String token = tokenProvider.generateToken(usuario.getId(), usuario.getUserRole().name());
        return new LoginResponse(token, UsuarioDTO.fromEntity(usuario));
    }

    public void recuperarSenha(String email) {
        if (!usuarioRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "E-mail não encontrado");
        }
    }
}
