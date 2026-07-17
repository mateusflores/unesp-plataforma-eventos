package br.unesp.backend.app.services;

import br.unesp.backend.model.entities.Evento;
import br.unesp.backend.model.entities.ingressos.CheckIn;
import br.unesp.backend.model.entities.ingressos.IngressoEmitido;
import br.unesp.backend.model.enums.StatusIngresso;
import br.unesp.backend.model.repositories.CheckInRepository;
import br.unesp.backend.model.repositories.EventoRepository;
import br.unesp.backend.model.repositories.IngressoEmitidoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZonedDateTime;

@Service
public class CheckInService {

    private final IngressoEmitidoRepository ingressoEmitidoRepository;
    private final CheckInRepository checkInRepository;
    private final EventoRepository eventoRepository;

    public CheckInService(IngressoEmitidoRepository ingressoEmitidoRepository,
                          CheckInRepository checkInRepository,
                          EventoRepository eventoRepository) {
        this.ingressoEmitidoRepository = ingressoEmitidoRepository;
        this.checkInRepository = checkInRepository;
        this.eventoRepository = eventoRepository;
    }

    public IngressoEmitido consultar(String codigoQR) {
        return ingressoEmitidoRepository.findByCodigoQR(codigoQR)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Ingresso não encontrado"));
    }

    @Transactional
    public IngressoEmitido registrar(String codigoQR, String responsavel) {
        IngressoEmitido ingresso = ingressoEmitidoRepository.findByCodigoQR(codigoQR)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Ingresso não encontrado"));

        if (ingresso.getStatusIngresso() == StatusIngresso.UTILIZADO) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ingresso já utilizado");
        }

        if (ingresso.getStatusIngresso() == StatusIngresso.CANCELADO) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "Ingresso cancelado");
        }

        CheckIn checkIn = CheckIn.builder()
                .ingressoEmitido(ingresso)
                .dataHora(ZonedDateTime.now())
                .responsavel(responsavel)
                .build();
        checkIn = checkInRepository.save(checkIn);

        ingresso.setStatusIngresso(StatusIngresso.UTILIZADO);
        ingresso.setCheckIn(checkIn);
        ingresso = ingressoEmitidoRepository.save(ingresso);

        return ingresso;
    }

    public java.util.List<CheckIn> doEvento(Long eventoId) {
        if (!eventoRepository.existsById(eventoId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado");
        }
        return checkInRepository.findByIngressoEmitidoEventoId(eventoId);
    }
}
