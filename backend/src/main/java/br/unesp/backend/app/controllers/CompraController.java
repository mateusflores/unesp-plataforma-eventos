package br.unesp.backend.app.controllers;

import br.unesp.backend.app.dtos.compra.CompraDTO;
import br.unesp.backend.app.dtos.compra.CompraRequest;
import br.unesp.backend.app.services.CompraService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CompraController {

    private final CompraService compraService;

    public CompraController(CompraService compraService) {
        this.compraService = compraService;
    }

    @PostMapping("/compras")
    public ResponseEntity<CompraDTO> criar(@RequestBody CompraRequest request) {
        var venda = compraService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(CompraDTO.fromEntity(venda));
    }

    @GetMapping("/usuarios/{usuarioId}/compras")
    public List<CompraDTO> doUsuario(@PathVariable Long usuarioId) {
        return compraService.doUsuario(usuarioId).stream()
                .map(CompraDTO::fromEntity)
                .toList();
    }

    @PatchMapping("/compras/{compraId}/cancelar")
    public ResponseEntity<CompraDTO> cancelar(@PathVariable Long compraId) {
        var venda = compraService.cancelar(compraId);
        return ResponseEntity.ok(CompraDTO.fromEntity(venda));
    }
}
