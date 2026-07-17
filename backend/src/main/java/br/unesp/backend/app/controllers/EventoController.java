package br.unesp.backend.app.controllers;

import br.unesp.backend.app.dtos.PaginadoDTO;
import br.unesp.backend.app.dtos.evento.EventoDTO;
import br.unesp.backend.app.dtos.evento.EventoRequest;
import br.unesp.backend.app.services.EventoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class EventoController {

    private final EventoService eventoService;

    public EventoController(EventoService eventoService) {
        this.eventoService = eventoService;
    }

    @GetMapping("/eventos")
    public PaginadoDTO<EventoDTO> listar(
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) Long universidadeId,
            @RequestParam(required = false) Long campusId,
            @RequestParam(required = false) List<Long> categoriaIds,
            @RequestParam(required = false) Boolean gratuito,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long organizadorId,
            @RequestParam(required = false) Boolean somenteDestaque,
            @RequestParam(defaultValue = "1") int pagina,
            @RequestParam(defaultValue = "9") int porPagina) {

        Page<EventoDTO> page = eventoService.listar(busca, universidadeId, campusId,
                        categoriaIds, gratuito, status, organizadorId, somenteDestaque,
                        pagina, porPagina)
                .map(EventoDTO::fromEntity);

        return new PaginadoDTO<>(
                page.getContent(),
                page.getTotalElements(),
                page.getNumber() + 1,
                page.getSize()
        );
    }

    @GetMapping("/eventos/destaques")
    public List<EventoDTO> destaques() {
        return eventoService.destaques().stream()
                .map(EventoDTO::fromEntity)
                .toList();
    }

    @GetMapping("/eventos/slug/{slug}")
    public ResponseEntity<EventoDTO> porSlug(@PathVariable String slug) {
        try {
            return ResponseEntity.ok(EventoDTO.fromEntity(eventoService.porSlug(slug)));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/eventos/{id}")
    public ResponseEntity<EventoDTO> porId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(EventoDTO.fromEntity(eventoService.porId(id)));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/organizadores/{organizadorId}/eventos")
    public List<EventoDTO> porOrganizador(@PathVariable Long organizadorId) {
        return eventoService.porOrganizador(organizadorId).stream()
                .map(EventoDTO::fromEntity)
                .toList();
    }

    @PostMapping("/eventos")
    public ResponseEntity<EventoDTO> criar(@Valid @RequestBody EventoRequest request) {
        var evento = eventoService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(EventoDTO.fromEntity(evento));
    }

    @PutMapping("/eventos/{id}")
    public ResponseEntity<EventoDTO> atualizar(@PathVariable Long id, @Valid @RequestBody EventoRequest request) {
        try {
            var evento = eventoService.atualizar(id, request);
            return ResponseEntity.ok(EventoDTO.fromEntity(evento));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/eventos/{id}/publicar")
    public ResponseEntity<Void> publicar(@PathVariable Long id) {
        try {
            eventoService.publicar(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/eventos/{id}/cancelar")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        try {
            eventoService.cancelar(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/eventos/{id}/duplicar")
    public ResponseEntity<EventoDTO> duplicar(@PathVariable Long id) {
        try {
            var evento = eventoService.duplicar(id);
            return ResponseEntity.status(HttpStatus.CREATED).body(EventoDTO.fromEntity(evento));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
