package br.unesp.backend.app.services;

import br.unesp.backend.model.entities.Evento;
import br.unesp.backend.model.entities.Inscricao;
import br.unesp.backend.model.entities.Usuario;
import br.unesp.backend.model.enums.StatusEvento;
import br.unesp.backend.model.enums.StatusInscricao;
import br.unesp.backend.model.repositories.EventoRepository;
import br.unesp.backend.model.repositories.InscricaoRepository;
import br.unesp.backend.model.repositories.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZonedDateTime;
import java.util.List;

@Service
public class InscricaoService {

    private final InscricaoRepository inscricaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EventoRepository eventoRepository;

    public InscricaoService(InscricaoRepository inscricaoRepository,
                            UsuarioRepository usuarioRepository,
                            EventoRepository eventoRepository) {
        this.inscricaoRepository = inscricaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.eventoRepository = eventoRepository;
    }

    @Transactional
    public Inscricao inscrever(Long usuarioId, Long eventoId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Evento não encontrado"));

        if (!evento.getGratuito()) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "Este evento não é gratuito. Utilize a opção de compra de ingressos.");
        }

        if (evento.getStatus() != StatusEvento.PUBLICADO) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "Evento indisponível para inscrição.");
        }

        if (evento.getCapacidade() != null
                && evento.getInscritos() != null
                && evento.getInscritos() >= evento.getCapacidade()) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "Evento lotado. Não há vagas disponíveis.");
        }

        if (inscricaoRepository.findByUsuarioIdAndEventoId(usuarioId, eventoId).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Você já está inscrito neste evento.");
        }

        Inscricao inscricao = new Inscricao();
        inscricao.setUsuario(usuario);
        inscricao.setEvento(evento);
        inscricao.setData(ZonedDateTime.now());
        inscricao.setStatus(StatusInscricao.CONFIRMADA);
        inscricao = inscricaoRepository.save(inscricao);

        evento.setInscritos(evento.getInscritos() + 1);
        eventoRepository.save(evento);

        return inscricao;
    }

    public List<Inscricao> doUsuario(Long usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }
        return inscricaoRepository.findByUsuarioId(usuarioId);
    }

    public Inscricao status(Long usuarioId, Long eventoId) {
        return inscricaoRepository.findByUsuarioIdAndEventoId(usuarioId, eventoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inscrição não encontrada"));
    }

    @Transactional
    public Inscricao cancelar(Long inscricaoId) {
        Inscricao inscricao = inscricaoRepository.findById(inscricaoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Inscrição não encontrada"));

        if (inscricao.getStatus() == StatusInscricao.CANCELADA) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Inscrição já cancelada.");
        }

        inscricao.setStatus(StatusInscricao.CANCELADA);
        inscricao = inscricaoRepository.save(inscricao);

        Evento evento = inscricao.getEvento();
        evento.setInscritos(Math.max(0, evento.getInscritos() - 1));
        eventoRepository.save(evento);

        return inscricao;
    }

    public List<Inscricao> participantesDoEvento(Long eventoId) {
        if (!eventoRepository.existsById(eventoId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado");
        }
        return inscricaoRepository.findByEventoId(eventoId);
    }
}
