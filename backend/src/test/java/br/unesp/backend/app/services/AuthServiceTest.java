package br.unesp.backend.app.services;

import br.unesp.backend.app.dtos.auth.*;
import br.unesp.backend.infra.security.JwtTokenProvider;
import br.unesp.backend.model.entities.Usuario;
import br.unesp.backend.model.enums.UserRole;
import br.unesp.backend.model.repositories.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UsuarioRepository usuarioRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtTokenProvider tokenProvider;

    @InjectMocks AuthService authService;

    private Usuario usuarioAtivo;
    private Usuario usuarioInativo;

    @BeforeEach
    void setUp() {
        usuarioAtivo = new Usuario();
        usuarioAtivo.setId(1L);
        usuarioAtivo.setNome("Ana");
        usuarioAtivo.setEmail("ana@agora.dev");
        usuarioAtivo.setSenha("$2a$10$encoded");
        usuarioAtivo.setUserRole(UserRole.PARTICIPANTE);
        usuarioAtivo.setIsAtivo(true);

        usuarioInativo = new Usuario();
        usuarioInativo.setId(2L);
        usuarioInativo.setNome("Inativo");
        usuarioInativo.setEmail("inativo@agora.dev");
        usuarioInativo.setSenha("$2a$10$encoded");
        usuarioInativo.setUserRole(UserRole.PARTICIPANTE);
        usuarioInativo.setIsAtivo(false);
    }

    @Test
    void registrar_comSucesso() {
        var request = new RegisterRequest("Ana", "ana@agora.dev", "123456", null);
        when(usuarioRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$encoded");
        when(usuarioRepository.save(any())).thenReturn(usuarioAtivo);
        when(tokenProvider.generateToken(anyLong(), anyString())).thenReturn("jwt-token");

        LoginResponse response = authService.registrar(request);

        assertEquals("jwt-token", response.token());
        assertEquals("Ana", response.usuario().nome());
        verify(usuarioRepository).save(any());
    }

    @Test
    void registrar_emailDuplicado_lanca409() {
        var request = new RegisterRequest("Ana", "ana@agora.dev", "123456", null);
        when(usuarioRepository.existsByEmail(anyString())).thenReturn(true);

        var ex = assertThrows(ResponseStatusException.class, () -> authService.registrar(request));
        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
    }

    @Test
    void login_comSucesso() {
        var request = new LoginRequest("ana@agora.dev", "123456");
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.of(usuarioAtivo));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(tokenProvider.generateToken(anyLong(), anyString())).thenReturn("jwt-token");

        LoginResponse response = authService.login(request);

        assertEquals("jwt-token", response.token());
        assertEquals("Ana", response.usuario().nome());
    }

    @Test
    void login_emailIncorreto_lanca401() {
        var request = new LoginRequest("naoexiste@agora.dev", "123456");
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        var ex = assertThrows(ResponseStatusException.class, () -> authService.login(request));
        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
    }

    @Test
    void login_senhaIncorreta_lanca401() {
        var request = new LoginRequest("ana@agora.dev", "senha_errada");
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.of(usuarioAtivo));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        var ex = assertThrows(ResponseStatusException.class, () -> authService.login(request));
        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
    }

    @Test
    void login_usuarioInativo_lanca403() {
        var request = new LoginRequest("inativo@agora.dev", "123456");
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.of(usuarioInativo));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

        var ex = assertThrows(ResponseStatusException.class, () -> authService.login(request));
        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
    }

    @Test
    void loginDemo_comSucesso() {
        var request = new DemoRequest(1L);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioAtivo));
        when(tokenProvider.generateToken(anyLong(), anyString())).thenReturn("jwt-token");

        LoginResponse response = authService.loginDemo(request);

        assertEquals("jwt-token", response.token());
    }

    @Test
    void loginDemo_idInexistente_lanca404() {
        var request = new DemoRequest(999L);
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        var ex = assertThrows(ResponseStatusException.class, () -> authService.loginDemo(request));
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }
}
