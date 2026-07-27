package br.unesp.backend.app.services;

import br.unesp.backend.model.entities.Evento;
import br.unesp.backend.model.entities.ingressos.CupomDesconto;
import br.unesp.backend.model.enums.StatusEvento;
import br.unesp.backend.model.enums.TipoDesconto;
import br.unesp.backend.model.repositories.CupomDescontoRepository;
import br.unesp.backend.model.repositories.EventoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CupomServiceTest {

    @Mock CupomDescontoRepository cupomRepository;
    @Mock EventoRepository eventoRepository;

    @InjectMocks CupomService cupomService;

    private CupomDesconto cupomValido;
    private CupomDesconto cupomInativo;
    private CupomDesconto cupomExpirado;
    private CupomDesconto cupomEsgotado;
    private Evento evento;

    @BeforeEach
    void setUp() {
        evento = new Evento();
        evento.setId(1L);
        evento.setStatus(StatusEvento.PUBLICADO);

        cupomValido = CupomDesconto.builder()
                .id(1L).codigo("DESC10").tipoDesconto(TipoDesconto.PERCENTUAL)
                .valor(BigDecimal.TEN).ativo(true)
                .quantidadeMaxima(100).quantidadeUsada(5)
                .validade(ZonedDateTime.now().plusDays(30))
                .evento(evento).build();

        cupomInativo = CupomDesconto.builder()
                .id(2L).codigo("INATIVO").tipoDesconto(TipoDesconto.PERCENTUAL)
                .valor(BigDecimal.TEN).ativo(false)
                .quantidadeMaxima(100).quantidadeUsada(0)
                .validade(ZonedDateTime.now().plusDays(30))
                .evento(evento).build();

        cupomExpirado = CupomDesconto.builder()
                .id(3L).codigo("EXPIRADO").tipoDesconto(TipoDesconto.PERCENTUAL)
                .valor(BigDecimal.TEN).ativo(true)
                .quantidadeMaxima(100).quantidadeUsada(0)
                .validade(ZonedDateTime.now().minusDays(1))
                .evento(evento).build();

        cupomEsgotado = CupomDesconto.builder()
                .id(4L).codigo("ESGOTADO").tipoDesconto(TipoDesconto.PERCENTUAL)
                .valor(BigDecimal.TEN).ativo(true)
                .quantidadeMaxima(100).quantidadeUsada(100)
                .validade(ZonedDateTime.now().plusDays(30))
                .evento(evento).build();
    }

    @Test
    void validar_cupomValido_retornaCupom() {
        when(cupomRepository.findByCodigo("DESC10")).thenReturn(Optional.of(cupomValido));

        CupomDesconto result = cupomService.validar("DESC10", 1L);

        assertEquals("DESC10", result.getCodigo());
    }

    @Test
    void validar_codigoInexistente_lanca404() {
        when(cupomRepository.findByCodigo("INEXISTENTE")).thenReturn(Optional.empty());

        var ex = assertThrows(ResponseStatusException.class,
                () -> cupomService.validar("INEXISTENTE", 1L));
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void validar_cupomInativo_lanca422() {
        when(cupomRepository.findByCodigo("INATIVO")).thenReturn(Optional.of(cupomInativo));

        var ex = assertThrows(ResponseStatusException.class,
                () -> cupomService.validar("INATIVO", 1L));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
    }

    @Test
    void validar_cupomExpirado_lanca422() {
        when(cupomRepository.findByCodigo("EXPIRADO")).thenReturn(Optional.of(cupomExpirado));

        var ex = assertThrows(ResponseStatusException.class,
                () -> cupomService.validar("EXPIRADO", 1L));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
    }

    @Test
    void validar_cupomEsgotado_lanca422() {
        when(cupomRepository.findByCodigo("ESGOTADO")).thenReturn(Optional.of(cupomEsgotado));

        var ex = assertThrows(ResponseStatusException.class,
                () -> cupomService.validar("ESGOTADO", 1L));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
    }

    @Test
    void validar_cupomDeOutroEvento_lanca422() {
        when(cupomRepository.findByCodigo("DESC10")).thenReturn(Optional.of(cupomValido));

        var ex = assertThrows(ResponseStatusException.class,
                () -> cupomService.validar("DESC10", 999L));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
    }

    @Test
    void validar_cupomSemEvento_aceito() {
        CupomDesconto cupomSemEvento = CupomDesconto.builder()
                .id(5L).codigo("GERAL").tipoDesconto(TipoDesconto.VALOR_FIXO)
                .valor(BigDecimal.valueOf(5)).ativo(true)
                .quantidadeMaxima(100).quantidadeUsada(0)
                .validade(ZonedDateTime.now().plusDays(30))
                .evento(null).build();

        when(cupomRepository.findByCodigo("GERAL")).thenReturn(Optional.of(cupomSemEvento));

        CupomDesconto result = cupomService.validar("GERAL", 1L);

        assertEquals("GERAL", result.getCodigo());
    }

    @Test
    void alternarAtivo_inverteStatus() {
        when(cupomRepository.findById(1L)).thenReturn(Optional.of(cupomValido));
        when(cupomRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        CupomDesconto result = cupomService.alternarAtivo(1L);

        assertFalse(result.getAtivo());
    }
}
