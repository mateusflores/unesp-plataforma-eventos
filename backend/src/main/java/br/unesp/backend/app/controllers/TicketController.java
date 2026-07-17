package br.unesp.backend.app.controllers;

import br.unesp.backend.app.dtos.ingresso.IngressoEmitidoDTO;
import br.unesp.backend.app.services.TicketService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping("/usuarios/{usuarioId}/ingressos")
    public List<IngressoEmitidoDTO> doUsuario(@PathVariable Long usuarioId) {
        return ticketService.doUsuario(usuarioId).stream()
                .map(IngressoEmitidoDTO::fromEntity)
                .toList();
    }

    @GetMapping("/eventos/{eventoId}/ingressos")
    public List<IngressoEmitidoDTO> doEvento(@PathVariable Long eventoId) {
        return ticketService.doEvento(eventoId).stream()
                .map(IngressoEmitidoDTO::fromEntity)
                .toList();
    }
}
