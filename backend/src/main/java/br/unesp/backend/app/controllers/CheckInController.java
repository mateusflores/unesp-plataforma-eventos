package br.unesp.backend.app.controllers;

import br.unesp.backend.app.dtos.checkin.CheckInDTO;
import br.unesp.backend.app.dtos.checkin.CheckInResultado;
import br.unesp.backend.app.dtos.checkin.RegistrarCheckInRequest;
import br.unesp.backend.app.dtos.ingresso.IngressoEmitidoDTO;
import br.unesp.backend.app.services.CheckInService;
import br.unesp.backend.model.entities.ingressos.IngressoEmitido;
import br.unesp.backend.model.enums.StatusIngresso;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CheckInController {

    private final CheckInService checkInService;

    public CheckInController(CheckInService checkInService) {
        this.checkInService = checkInService;
    }

    @GetMapping("/checkin/{codigoQR}")
    public ResponseEntity<CheckInResultado> consultar(@PathVariable String codigoQR) {
        try {
            IngressoEmitido ingresso = checkInService.consultar(codigoQR);
            var dto = IngressoEmitidoDTO.fromEntity(ingresso);
            String tipo = switch (ingresso.getStatusIngresso()) {
                case VALIDO -> "VALIDO";
                case UTILIZADO -> "JA_UTILIZADO";
                case CANCELADO -> "CANCELADO";
            };
            return ResponseEntity.ok(new CheckInResultado(tipo, dto));
        } catch (Exception e) {
            return ResponseEntity.ok(new CheckInResultado("INEXISTENTE", null));
        }
    }

    @PostMapping("/checkin")
    public ResponseEntity<IngressoEmitidoDTO> registrar(@RequestBody RegistrarCheckInRequest request) {
        var ingresso = checkInService.registrar(request.codigoQR(), request.responsavel());
        return ResponseEntity.ok(IngressoEmitidoDTO.fromEntity(ingresso));
    }

    @GetMapping("/eventos/{eventoId}/checkins")
    public List<CheckInDTO> doEvento(@PathVariable Long eventoId) {
        return checkInService.doEvento(eventoId).stream()
                .map(CheckInDTO::fromEntity)
                .toList();
    }
}
