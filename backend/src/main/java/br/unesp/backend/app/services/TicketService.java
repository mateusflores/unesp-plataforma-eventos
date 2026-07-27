package br.unesp.backend.app.services;

import br.unesp.backend.model.entities.ingressos.IngressoEmitido;
import br.unesp.backend.model.repositories.EventoRepository;
import br.unesp.backend.model.repositories.IngressoEmitidoRepository;
import br.unesp.backend.model.repositories.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TicketService {

    private final IngressoEmitidoRepository ingressoEmitidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EventoRepository eventoRepository;

    public TicketService(IngressoEmitidoRepository ingressoEmitidoRepository,
                         UsuarioRepository usuarioRepository,
                         EventoRepository eventoRepository) {
        this.ingressoEmitidoRepository = ingressoEmitidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.eventoRepository = eventoRepository;
    }

    public List<IngressoEmitido> doUsuario(Long usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }
        return ingressoEmitidoRepository.findByUsuarioId(usuarioId);
    }

    public List<IngressoEmitido> doEvento(Long eventoId) {
        if (!eventoRepository.existsById(eventoId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado");
        }
        return ingressoEmitidoRepository.findByEventoId(eventoId);
    }
}
