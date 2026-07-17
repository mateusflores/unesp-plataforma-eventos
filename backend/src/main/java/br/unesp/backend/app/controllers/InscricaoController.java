package br.unesp.backend.app.controllers;

import br.unesp.backend.app.dtos.inscricao.InscricaoDTO;
import br.unesp.backend.app.services.InscricaoService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class InscricaoController {

    private final InscricaoService inscricaoService;

    public InscricaoController(InscricaoService inscricaoService) {
        this.inscricaoService = inscricaoService;
    }

    @PostMapping("/inscricoes")
    public ResponseEntity<InscricaoDTO> inscrever(@RequestBody Map<String, Long> body) {
        Long usuarioId = body.get("usuarioId");
        Long eventoId = body.get("eventoId");
        var inscricao = inscricaoService.inscrever(usuarioId, eventoId);
        return ResponseEntity.status(HttpStatus.CREATED).body(InscricaoDTO.fromEntity(inscricao));
    }

    @GetMapping("/usuarios/{usuarioId}/inscricoes")
    public List<InscricaoDTO> doUsuario(@PathVariable Long usuarioId) {
        return inscricaoService.doUsuario(usuarioId).stream()
                .map(InscricaoDTO::fromEntity)
                .toList();
    }

    @GetMapping("/inscricoes/status")
    public ResponseEntity<InscricaoDTO> status(
            @RequestParam Long usuarioId,
            @RequestParam Long eventoId) {
        try {
            var inscricao = inscricaoService.status(usuarioId, eventoId);
            return ResponseEntity.ok(InscricaoDTO.fromEntity(inscricao));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.noContent().build();
        }
    }

    @PatchMapping("/inscricoes/{id}/cancelar")
    public ResponseEntity<InscricaoDTO> cancelar(@PathVariable Long id) {
        var inscricao = inscricaoService.cancelar(id);
        return ResponseEntity.ok(InscricaoDTO.fromEntity(inscricao));
    }

    @GetMapping("/eventos/{eventoId}/inscricoes")
    public List<InscricaoDTO> participantesDoEvento(@PathVariable Long eventoId) {
        return inscricaoService.participantesDoEvento(eventoId).stream()
                .map(InscricaoDTO::fromEntity)
                .toList();
    }
}
