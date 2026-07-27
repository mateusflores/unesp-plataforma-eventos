package br.unesp.backend.app.services;

import br.unesp.backend.model.entities.Evento;
import br.unesp.backend.model.entities.Inscricao;
import br.unesp.backend.model.entities.Usuario;
import br.unesp.backend.model.enums.StatusEvento;
import br.unesp.backend.model.enums.StatusInscricao;
import br.unesp.backend.model.enums.UserRole;
import br.unesp.backend.model.repositories.EventoRepository;
import br.unesp.backend.model.repositories.InscricaoRepository;
import br.unesp.backend.model.repositories.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZonedDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InscricaoServiceTest {

    @Mock InscricaoRepository inscricaoRepository;
    @Mock UsuarioRepository usuarioRepository;
    @Mock EventoRepository eventoRepository;

    @InjectMocks InscricaoService inscricaoService;

    private Usuario usuario;
    private Evento eventoGratuito;
    private Evento eventoPago;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("Ana");
        usuario.setEmail("ana@agora.dev");
        usuario.setUserRole(UserRole.PARTICIPANTE);

        eventoGratuito = new Evento();
        eventoGratuito.setId(1L);
        eventoGratuito.setGratuito(true);
        eventoGratuito.setStatus(StatusEvento.PUBLICADO);
        eventoGratuito.setCapacidade(100);
        eventoGratuito.setInscritos(0);

        eventoPago = new Evento();
        eventoPago.setId(2L);
        eventoPago.setGratuito(false);
        eventoPago.setStatus(StatusEvento.PUBLICADO);
    }

    @Test
    void inscrever_comSucesso() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(eventoRepository.findById(1L)).thenReturn(Optional.of(eventoGratuito));
        when(inscricaoRepository.findByUsuarioIdAndEventoId(1L, 1L)).thenReturn(Optional.empty());

        var inscricaoMock = new Inscricao();
        inscricaoMock.setId(1L);
        inscricaoMock.setUsuario(usuario);
        inscricaoMock.setEvento(eventoGratuito);
        inscricaoMock.setData(ZonedDateTime.now());
        inscricaoMock.setStatus(StatusInscricao.CONFIRMADA);

        when(inscricaoRepository.save(any())).thenReturn(inscricaoMock);

        Inscricao result = inscricaoService.inscrever(1L, 1L);

        assertNotNull(result);
        assertEquals(StatusInscricao.CONFIRMADA, result.getStatus());
        verify(eventoRepository).save(eventoGratuito);
        assertEquals(1, eventoGratuito.getInscritos());
    }

    @Test
    void inscrever_eventoPago_lanca422() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(eventoRepository.findById(2L)).thenReturn(Optional.of(eventoPago));

        var ex = assertThrows(ResponseStatusException.class,
                () -> inscricaoService.inscrever(1L, 2L));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
    }

    @Test
    void inscrever_eventoNaoPublicado_lanca422() {
        eventoGratuito.setStatus(StatusEvento.RASCUNHO);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(eventoRepository.findById(1L)).thenReturn(Optional.of(eventoGratuito));

        var ex = assertThrows(ResponseStatusException.class,
                () -> inscricaoService.inscrever(1L, 1L));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
    }

    @Test
    void inscrever_eventoLotado_lanca422() {
        eventoGratuito.setInscritos(100);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(eventoRepository.findById(1L)).thenReturn(Optional.of(eventoGratuito));

        var ex = assertThrows(ResponseStatusException.class,
                () -> inscricaoService.inscrever(1L, 1L));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
    }

    @Test
    void inscrever_jaInscrito_lanca409() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(eventoRepository.findById(1L)).thenReturn(Optional.of(eventoGratuito));
        when(inscricaoRepository.findByUsuarioIdAndEventoId(1L, 1L))
                .thenReturn(Optional.of(new Inscricao()));

        var ex = assertThrows(ResponseStatusException.class,
                () -> inscricaoService.inscrever(1L, 1L));
        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
    }

    @Test
    void cancelar_comSucesso() {
        Inscricao inscricao = new Inscricao();
        inscricao.setId(1L);
        inscricao.setUsuario(usuario);
        inscricao.setEvento(eventoGratuito);
        inscricao.setStatus(StatusInscricao.CONFIRMADA);

        when(inscricaoRepository.findById(1L)).thenReturn(Optional.of(inscricao));
        when(inscricaoRepository.save(any())).thenReturn(inscricao);

        Inscricao result = inscricaoService.cancelar(1L);

        assertEquals(StatusInscricao.CANCELADA, result.getStatus());
        verify(eventoRepository).save(eventoGratuito);
    }

    @Test
    void cancelar_jaCancelada_lanca409() {
        Inscricao inscricao = new Inscricao();
        inscricao.setId(1L);
        inscricao.setStatus(StatusInscricao.CANCELADA);

        when(inscricaoRepository.findById(1L)).thenReturn(Optional.of(inscricao));

        var ex = assertThrows(ResponseStatusException.class,
                () -> inscricaoService.cancelar(1L));
        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
    }
}
