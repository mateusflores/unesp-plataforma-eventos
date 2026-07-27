package br.unesp.backend.app.services;

import br.unesp.backend.app.dtos.evento.EventoRequest;
import br.unesp.backend.model.entities.*;
import br.unesp.backend.model.enums.StatusEvento;
import br.unesp.backend.model.repositories.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventoServiceTest {

    @Mock EventoRepository eventoRepository;
    @Mock OrganizadorRepository organizadorRepository;
    @Mock UniversidadeRepository universidadeRepository;
    @Mock CampusRepository campusRepository;
    @Mock CategoriaRepository categoriaRepository;
    @Mock TagRepository tagRepository;
    @Mock IngressoRepository ingressoRepository;
    @Mock LoteRepository loteRepository;

    @InjectMocks EventoService eventoService;

    private Evento evento;
    private Organizador organizador;

    @BeforeEach
    void setUp() {
        organizador = new Organizador();
        organizador.setId(1L);

        evento = new Evento();
        evento.setId(1L);
        evento.setTitulo("Evento Teste");
        evento.setSlug("evento-teste");
        evento.setStatus(StatusEvento.RASCUNHO);
        evento.setOrganizador(organizador);
        evento.setDataInicio(java.time.ZonedDateTime.now());
    }

    @Test
    void porSlug_encontrado() {
        when(eventoRepository.findBySlug("evento-teste")).thenReturn(Optional.of(evento));

        Evento result = eventoService.porSlug("evento-teste");

        assertEquals("Evento Teste", result.getTitulo());
    }

    @Test
    void porSlug_naoEncontrado_lanca404() {
        when(eventoRepository.findBySlug("inexistente")).thenReturn(Optional.empty());

        var ex = assertThrows(ResponseStatusException.class,
                () -> eventoService.porSlug("inexistente"));
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void porId_naoEncontrado_lanca404() {
        when(eventoRepository.findById(999L)).thenReturn(Optional.empty());

        var ex = assertThrows(ResponseStatusException.class,
                () -> eventoService.porId(999L));
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void publicar_eventoValido_alteraStatus() {
        evento.setTitulo("Evento Teste");
        evento.setDataInicio(java.time.ZonedDateTime.now());
        evento.setOrganizador(organizador);
        when(eventoRepository.findById(1L)).thenReturn(Optional.of(evento));

        eventoService.publicar(1L);

        assertEquals(StatusEvento.PUBLICADO, evento.getStatus());
        verify(eventoRepository).save(evento);
    }

    @Test
    void publicar_semTitulo_lanca422() {
        evento.setTitulo(null);
        when(eventoRepository.findById(1L)).thenReturn(Optional.of(evento));

        var ex = assertThrows(ResponseStatusException.class,
                () -> eventoService.publicar(1L));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
    }

    @Test
    void publicar_semData_lanca422() {
        evento.setDataInicio(null);
        when(eventoRepository.findById(1L)).thenReturn(Optional.of(evento));

        var ex = assertThrows(ResponseStatusException.class,
                () -> eventoService.publicar(1L));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
    }

    @Test
    void duplicar_copiaCategoriasETags() {
        Categoria cat = new Categoria();
        cat.setId(1L);
        evento.setCategorias(List.of(cat));
        evento.setTags(List.of());
        evento.setIngressos(null);

        when(eventoRepository.findById(1L)).thenReturn(Optional.of(evento));
        when(eventoRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Evento copia = eventoService.duplicar(1L);

        assertEquals("Evento Teste (cópia)", copia.getTitulo());
        assertEquals(1, copia.getCategorias().size());
        assertEquals(StatusEvento.RASCUNHO, copia.getStatus());
    }

    @Test
    void duplicar_semCategorias_naoLancaNPE() {
        evento.setCategorias(null);
        evento.setTags(null);
        evento.setIngressos(null);

        when(eventoRepository.findById(1L)).thenReturn(Optional.of(evento));
        when(eventoRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        assertDoesNotThrow(() -> eventoService.duplicar(1L));
    }

    @Test
    void criar_comStatusInvalido_lanca400() {
        var request = new EventoRequest(
                "Teste", null, null, null, true, true,
                null, null, null, null, null, null, 1L,
                null, null, "STATUS_INVALIDO", null, null);

        when(organizadorRepository.findById(1L)).thenReturn(Optional.of(organizador));

        var ex = assertThrows(ResponseStatusException.class,
                () -> eventoService.criar(request));
        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
    }

    @Test
    void gerarSlug_corretamente() {
        assertEquals("festa-do-calouro-2026",
                EventoService.gerarSlug("Festa do Calouro 2026"));
        assertEquals("evento-com-acentuação",
                EventoService.gerarSlug("Evento com Acentuação"));
        assertEquals("a-b-c", EventoService.gerarSlug("  A    B   C  "));
    }
}
