package br.unesp.backend.app.services;

import br.unesp.backend.app.dtos.compra.CompraRequest;
import br.unesp.backend.model.entities.*;
import br.unesp.backend.model.entities.ingressos.*;
import br.unesp.backend.model.enums.*;
import br.unesp.backend.model.repositories.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CompraService {

    private final VendaRepository vendaRepository;
    private final ItemVendaRepository itemVendaRepository;
    private final PagamentoRepository pagamentoRepository;
    private final IngressoEmitidoRepository ingressoEmitidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EventoRepository eventoRepository;
    private final IngressoRepository ingressoRepository;
    private final LoteRepository loteRepository;
    private final CupomDescontoRepository cupomRepository;

    public CompraService(VendaRepository vendaRepository,
                         ItemVendaRepository itemVendaRepository,
                         PagamentoRepository pagamentoRepository,
                         IngressoEmitidoRepository ingressoEmitidoRepository,
                         UsuarioRepository usuarioRepository,
                         EventoRepository eventoRepository,
                         IngressoRepository ingressoRepository,
                         LoteRepository loteRepository,
                         CupomDescontoRepository cupomRepository) {
        this.vendaRepository = vendaRepository;
        this.itemVendaRepository = itemVendaRepository;
        this.pagamentoRepository = pagamentoRepository;
        this.ingressoEmitidoRepository = ingressoEmitidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.eventoRepository = eventoRepository;
        this.ingressoRepository = ingressoRepository;
        this.loteRepository = loteRepository;
        this.cupomRepository = cupomRepository;
    }

    @Transactional
    public Venda criar(CompraRequest request) {
        Usuario usuario = usuarioRepository.findById(request.usuarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        Evento evento = eventoRepository.findById(request.eventoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado"));

        if (evento.getGratuito()) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "Este evento é gratuito. Utilize a opção de inscrição.");
        }

        if (evento.getStatus() != StatusEvento.PUBLICADO) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "Evento indisponível para compra.");
        }

        if (request.itens() == null || request.itens().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe ao menos um ingresso.");
        }

        MetodoPagamento metodo = mapMetodo(request.metodo());

        BigDecimal valorTotal = BigDecimal.ZERO;
        BigDecimal desconto = BigDecimal.ZERO;
        List<ItemVenda> itens = new ArrayList<>();

        for (CompraRequest.ItemRequest itemReq : request.itens()) {
            Ingresso ingresso = ingressoRepository.findById(itemReq.ingressoId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Ingresso não encontrado: " + itemReq.ingressoId()));

            Lote lote = loteRepository.findById(itemReq.loteId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Lote não encontrado: " + itemReq.loteId()));

            if (lote.getQuantidadeDisponivel() < itemReq.quantidade()) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                        "Quantidade indisponível para o lote \"" + lote.getNome() + "\". Disponível: "
                                + lote.getQuantidadeDisponivel());
            }

            BigDecimal subtotal = lote.getPreco().multiply(BigDecimal.valueOf(itemReq.quantidade()));
            valorTotal = valorTotal.add(subtotal);

            ItemVenda item = new ItemVenda();
            item.setQuantidade(itemReq.quantidade());
            item.setValorUnitario(lote.getPreco());
            item.setDescricao(ingresso.getNome() + " - " + lote.getNome());
            item.setIngresso(ingresso);
            item.setLote(lote);
            itens.add(item);

            lote.setQuantidadeDisponivel(lote.getQuantidadeDisponivel() - itemReq.quantidade());
            loteRepository.save(lote);
        }

        CupomDesconto cupom = null;
        if (request.cupomCodigo() != null && !request.cupomCodigo().isBlank()) {
            cupom = cupomRepository.findByCodigo(request.cupomCodigo())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cupom não encontrado"));

            if (!Boolean.TRUE.equals(cupom.getAtivo())) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Cupom inativo");
            }
            if (cupom.getValidade() != null && cupom.getValidade().isBefore(ZonedDateTime.now())) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Cupom expirado");
            }
            if (cupom.getQuantidadeMaxima() != null && cupom.getQuantidadeUsada() >= cupom.getQuantidadeMaxima()) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Cupom esgotado");
            }

            if (cupom.getTipoDesconto() == TipoDesconto.PERCENTUAL) {
                desconto = valorTotal.multiply(cupom.getValor()).divide(BigDecimal.valueOf(100));
            } else {
                desconto = cupom.getValor().min(valorTotal);
            }

            cupom.setQuantidadeUsada(cupom.getQuantidadeUsada() + 1);
            cupomRepository.save(cupom);
        }

        BigDecimal valorFinal = valorTotal.subtract(desconto).max(BigDecimal.ZERO);

        Pagamento pagamento = new Pagamento();
        pagamento.setMetodoPagamento(metodo);
        pagamento.setStatusPagamento(StatusPagamento.APROVADO);
        pagamento.setDataPagamento(ZonedDateTime.now());
        pagamento.setDataAprovado(ZonedDateTime.now());
        pagamento.setValorPagamento(valorFinal);
        pagamento = pagamentoRepository.save(pagamento);

        Venda venda = Venda.builder()
                .data(ZonedDateTime.now())
                .valorTotal(valorFinal)
                .valorDesconto(desconto)
                .status(StatusVenda.PAGO)
                .usuario(usuario)
                .evento(evento)
                .cupomDesconto(cupom)
                .pagamento(pagamento)
                .build();
        venda = vendaRepository.save(venda);

        for (ItemVenda item : itens) {
            item.setVenda(venda);
            item = itemVendaRepository.save(item);

            for (int i = 0; i < item.getQuantidade(); i++) {
                IngressoEmitido emitido = IngressoEmitido.builder()
                        .codigoQR(UUID.randomUUID().toString())
                        .statusIngresso(StatusIngresso.VALIDO)
                        .dataEmissao(ZonedDateTime.now())
                        .ingressoNome(item.getDescricao())
                        .loteNome(item.getLote().getNome())
                        .venda(venda)
                        .itemVenda(item)
                        .usuario(usuario)
                        .evento(evento)
                        .build();
                ingressoEmitidoRepository.save(emitido);
            }
        }

        return vendaRepository.findById(venda.getId()).orElse(venda);
    }

    public List<Venda> doUsuario(Long usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }
        return vendaRepository.findByUsuarioId(usuarioId);
    }

    @Transactional
    public Venda cancelar(Long compraId) {
        Venda venda = vendaRepository.findById(compraId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Compra não encontrada"));

        if (venda.getStatus() == StatusVenda.CANCELADO) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Compra já cancelada.");
        }

        venda.setStatus(StatusVenda.CANCELADO);
        venda = vendaRepository.save(venda);

        if (venda.getItemVendaList() != null) {
            for (ItemVenda item : venda.getItemVendaList()) {
                if (item.getLote() != null) {
                    Lote lote = item.getLote();
                    lote.setQuantidadeDisponivel(lote.getQuantidadeDisponivel() + item.getQuantidade());
                    loteRepository.save(lote);
                }
            }
        }

        var ingressos = ingressoEmitidoRepository.findByVendaId(venda.getId());
        for (IngressoEmitido ing : ingressos) {
            ing.setStatusIngresso(StatusIngresso.CANCELADO);
            ingressoEmitidoRepository.save(ing);
        }

        return vendaRepository.findById(venda.getId()).orElse(venda);
    }

    private MetodoPagamento mapMetodo(String metodo) {
        if (metodo == null) return MetodoPagamento.PIX;
        return switch (metodo.toUpperCase()) {
            case "PIX" -> MetodoPagamento.PIX;
            case "CARTAO" -> MetodoPagamento.CARTAO_CREDITO;
            case "BOLETO" -> MetodoPagamento.BOLETO;
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Método de pagamento inválido: " + metodo);
        };
    }
}
