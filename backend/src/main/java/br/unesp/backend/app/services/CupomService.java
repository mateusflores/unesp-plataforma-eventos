package br.unesp.backend.app.services;

import br.unesp.backend.app.dtos.cupom.CupomRequest;
import br.unesp.backend.model.entities.Evento;
import br.unesp.backend.model.entities.ingressos.CupomDesconto;
import br.unesp.backend.model.enums.TipoDesconto;
import br.unesp.backend.model.repositories.CupomDescontoRepository;
import br.unesp.backend.model.repositories.EventoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZonedDateTime;
import java.util.List;

@Service
public class CupomService {

    private final CupomDescontoRepository cupomRepository;
    private final EventoRepository eventoRepository;

    public CupomService(CupomDescontoRepository cupomRepository,
                        EventoRepository eventoRepository) {
        this.cupomRepository = cupomRepository;
        this.eventoRepository = eventoRepository;
    }

    public CupomDesconto validar(String codigo, Long eventoId) {
        CupomDesconto cupom = cupomRepository.findByCodigo(codigo)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Cupom não encontrado"));

        if (!Boolean.TRUE.equals(cupom.getAtivo())) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY, "Cupom inativo");
        }

        if (cupom.getValidade() != null && cupom.getValidade().isBefore(ZonedDateTime.now())) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY, "Cupom expirado");
        }

        if (cupom.getQuantidadeMaxima() != null
                && cupom.getQuantidadeUsada() >= cupom.getQuantidadeMaxima()) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY, "Cupom esgotado");
        }

        if (eventoId != null && cupom.getEvento() != null
                && !cupom.getEvento().getId().equals(eventoId)) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY, "Cupom não válido para este evento");
        }

        return cupom;
    }

    public List<CupomDesconto> doEvento(Long eventoId) {
        if (!eventoRepository.existsById(eventoId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado");
        }
        return cupomRepository.findByEventoId(eventoId);
    }

    public List<CupomDesconto> doOrganizador(Long organizadorId) {
        return cupomRepository.findAll().stream()
                .filter(c -> c.getEvento() != null
                        && c.getEvento().getOrganizador() != null
                        && c.getEvento().getOrganizador().getId().equals(organizadorId))
                .toList();
    }

    @Transactional
    public CupomDesconto salvar(CupomRequest request) {
        CupomDesconto cupom = new CupomDesconto();
        aplicarRequest(cupom, request);
        return cupomRepository.save(cupom);
    }

    @Transactional
    public CupomDesconto atualizar(Long id, CupomRequest request) {
        CupomDesconto cupom = cupomRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Cupom não encontrado"));
        aplicarRequest(cupom, request);
        return cupomRepository.save(cupom);
    }

    @Transactional
    public CupomDesconto alternarAtivo(Long id) {
        CupomDesconto cupom = cupomRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Cupom não encontrado"));
        cupom.setAtivo(!Boolean.TRUE.equals(cupom.getAtivo()));
        return cupomRepository.save(cupom);
    }

    private void aplicarRequest(CupomDesconto cupom, CupomRequest request) {
        if (request.codigo() != null) cupom.setCodigo(request.codigo());
        if (request.tipo() != null) cupom.setTipoDesconto(TipoDesconto.valueOf(request.tipo()));
        if (request.valor() != null) cupom.setValor(request.valor());
        if (request.quantidadeMaxima() != null) cupom.setQuantidadeMaxima(request.quantidadeMaxima());
        if (request.validade() != null) cupom.setValidade(ZonedDateTime.parse(request.validade()));
        if (request.ativo() != null) cupom.setAtivo(request.ativo());

        if (request.eventoId() != null) {
            Evento evento = eventoRepository.findById(request.eventoId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Evento não encontrado"));
            cupom.setEvento(evento);
        }
    }
}
