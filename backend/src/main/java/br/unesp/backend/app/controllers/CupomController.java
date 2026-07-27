package br.unesp.backend.app.controllers;

import br.unesp.backend.app.dtos.cupom.CupomDTO;
import br.unesp.backend.app.dtos.cupom.CupomRequest;
import br.unesp.backend.app.dtos.cupom.ValidarCupomRequest;
import br.unesp.backend.app.services.CupomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CupomController {

    private final CupomService cupomService;

    public CupomController(CupomService cupomService) {
        this.cupomService = cupomService;
    }

    @PostMapping("/cupons/validar")
    public ResponseEntity<CupomDTO> validar(@Valid @RequestBody ValidarCupomRequest request) {
        var cupom = cupomService.validar(request.codigo(), request.eventoId());
        return ResponseEntity.ok(CupomDTO.fromEntity(cupom));
    }

    @GetMapping("/eventos/{eventoId}/cupons")
    public List<CupomDTO> doEvento(@PathVariable Long eventoId) {
        return cupomService.doEvento(eventoId).stream()
                .map(CupomDTO::fromEntity)
                .toList();
    }

    @GetMapping("/organizadores/{organizadorId}/cupons")
    public List<CupomDTO> doOrganizador(@PathVariable Long organizadorId) {
        return cupomService.doOrganizador(organizadorId).stream()
                .map(CupomDTO::fromEntity)
                .toList();
    }

    @PostMapping("/cupons")
    public ResponseEntity<CupomDTO> criar(@Valid @RequestBody CupomRequest request) {
        var cupom = cupomService.salvar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(CupomDTO.fromEntity(cupom));
    }

    @PutMapping("/cupons/{id}")
    public ResponseEntity<CupomDTO> atualizar(@PathVariable Long id, @Valid @RequestBody CupomRequest request) {
        var cupom = cupomService.atualizar(id, request);
        return ResponseEntity.ok(CupomDTO.fromEntity(cupom));
    }

    @PatchMapping("/cupons/{id}/alternar")
    public ResponseEntity<CupomDTO> alternarAtivo(@PathVariable Long id) {
        var cupom = cupomService.alternarAtivo(id);
        return ResponseEntity.ok(CupomDTO.fromEntity(cupom));
    }
}
