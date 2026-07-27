package br.unesp.backend.app.services;

import br.unesp.backend.app.dtos.compra.CompraRequest;
import br.unesp.backend.model.entities.*;
import br.unesp.backend.model.entities.ingressos.*;
import br.unesp.backend.model.enums.*;
import br.unesp.backend.model.repositories.*;
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
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CompraServiceTest {

    @Mock VendaRepository vendaRepository;
    @Mock ItemVendaRepository itemVendaRepository;
    @Mock PagamentoRepository pagamentoRepository;
    @Mock IngressoEmitidoRepository ingressoEmitidoRepository;
    @Mock UsuarioRepository usuarioRepository;
    @Mock EventoRepository eventoRepository;
    @Mock IngressoRepository ingressoRepository;
    @Mock LoteRepository loteRepository;
    @Mock CupomDescontoRepository cupomRepository;
    @Mock CupomService cupomService;

    @InjectMocks CompraService compraService;

    private Usuario usuario;
    private Evento evento;
    private Ingresso ingresso;
    private Lote lote;
    private CupomDesconto cupomValido;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("Ana");

        evento = new Evento();
        evento.setId(1L);
        evento.setGratuito(false);
        evento.setStatus(StatusEvento.PUBLICADO);

        ingresso = new Ingresso();
        ingresso.setId(1L);
        ingresso.setNome("Pista");
        ingresso.setEvento(evento);

        lote = new Lote();
        lote.setId(1L);
        lote.setNome("1º Lote");
        lote.setPreco(BigDecimal.valueOf(50));
        lote.setQuantidadeTotal(100);
        lote.setQuantidadeDisponivel(50);
        lote.setIngresso(ingresso);

        cupomValido = CupomDesconto.builder()
                .id(1L).codigo("DESC10").tipoDesconto(TipoDesconto.PERCENTUAL)
                .valor(BigDecimal.TEN).ativo(true)
                .quantidadeMaxima(100).quantidadeUsada(5)
                .validade(ZonedDateTime.now().plusDays(30))
                .evento(evento).build();
    }

    @Test
    void criar_compraValida() {
        var request = new CompraRequest(
                1L, 1L,
                List.of(new CompraRequest.ItemRequest(1L, 1L, 2)),
                null, "PIX");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(eventoRepository.findById(1L)).thenReturn(Optional.of(evento));
        when(ingressoRepository.findById(1L)).thenReturn(Optional.of(ingresso));
        when(loteRepository.findById(1L)).thenReturn(Optional.of(lote));
        when(itemVendaRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(pagamentoRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(vendaRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(vendaRepository.findById(any())).thenAnswer(i -> {
            Venda v = i.getArgument(0, Venda.class);
            return Optional.ofNullable(v);
        });

        Venda result = compraService.criar(request);

        assertNotNull(result);
        assertEquals(BigDecimal.valueOf(100), result.getValorTotal()); // 2 * 50
        verify(itemVendaRepository, atLeastOnce()).save(any());
        verify(ingressoEmitidoRepository, atLeastOnce()).save(any());
    }

    @Test
    void criar_itensVazios_lanca400() {
        var request = new CompraRequest(1L, 1L, List.of(), null, "PIX");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(eventoRepository.findById(1L)).thenReturn(Optional.of(evento));

        var ex = assertThrows(ResponseStatusException.class,
                () -> compraService.criar(request));
        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
    }

    @Test
    void criar_loteInsuficiente_lanca422() {
        lote.setQuantidadeDisponivel(1);
        var request = new CompraRequest(
                1L, 1L,
                List.of(new CompraRequest.ItemRequest(1L, 1L, 5)),
                null, "PIX");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(eventoRepository.findById(1L)).thenReturn(Optional.of(evento));
        when(ingressoRepository.findById(1L)).thenReturn(Optional.of(ingresso));
        when(loteRepository.findById(1L)).thenReturn(Optional.of(lote));

        var ex = assertThrows(ResponseStatusException.class,
                () -> compraService.criar(request));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
    }

    @Test
    void criar_comCupomValido_aplicaDesconto() {
        var request = new CompraRequest(
                1L, 1L,
                List.of(new CompraRequest.ItemRequest(1L, 1L, 2)),
                "DESC10", "PIX");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(eventoRepository.findById(1L)).thenReturn(Optional.of(evento));
        when(ingressoRepository.findById(1L)).thenReturn(Optional.of(ingresso));
        when(loteRepository.findById(1L)).thenReturn(Optional.of(lote));
        when(itemVendaRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(cupomService.validar("DESC10", 1L)).thenReturn(cupomValido);
        when(cupomRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(pagamentoRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(vendaRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(vendaRepository.findById(any())).thenAnswer(i -> {
            Venda v = i.getArgument(0, Venda.class);
            return Optional.ofNullable(v);
        });

        Venda result = compraService.criar(request);

        // 2 * 50 = 100, desconto 10% = 10, total = 90
        assertEquals(BigDecimal.valueOf(90), result.getValorTotal());
        assertEquals(BigDecimal.TEN, result.getValorDesconto());
    }

    @Test
    void cancelar_comSucesso() {
        Venda venda = Venda.builder()
                .id(1L).status(StatusVenda.PENDENTE)
                .itemVendaList(List.of())
                .build();

        when(vendaRepository.findById(1L)).thenReturn(Optional.of(venda));
        when(vendaRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Venda result = compraService.cancelar(1L);

        assertEquals(StatusVenda.CANCELADO, result.getStatus());
    }

    @Test
    void cancelar_jaCancelada_lanca409() {
        Venda venda = Venda.builder()
                .id(1L).status(StatusVenda.CANCELADO).build();

        when(vendaRepository.findById(1L)).thenReturn(Optional.of(venda));

        var ex = assertThrows(ResponseStatusException.class,
                () -> compraService.cancelar(1L));
        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
    }

    @Test
    void criar_eventoGratuito_lanca422() {
        evento.setGratuito(true);
        var request = new CompraRequest(
                1L, 1L,
                List.of(new CompraRequest.ItemRequest(1L, 1L, 1)),
                null, "PIX");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(eventoRepository.findById(1L)).thenReturn(Optional.of(evento));

        var ex = assertThrows(ResponseStatusException.class,
                () -> compraService.criar(request));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
    }

    @Test
    void criar_eventoNaoPublicado_lanca422() {
        evento.setStatus(StatusEvento.RASCUNHO);
        var request = new CompraRequest(
                1L, 1L,
                List.of(new CompraRequest.ItemRequest(1L, 1L, 1)),
                null, "PIX");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(eventoRepository.findById(1L)).thenReturn(Optional.of(evento));

        var ex = assertThrows(ResponseStatusException.class,
                () -> compraService.criar(request));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
    }
}
