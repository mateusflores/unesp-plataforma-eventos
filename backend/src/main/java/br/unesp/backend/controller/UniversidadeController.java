package br.unesp.backend.controller;

import br.unesp.backend.dto.universidade.UniversidadeRequest;
import br.unesp.backend.dto.universidade.UniversidadeSummary;
import br.unesp.backend.model.Universidade;
import br.unesp.backend.service.UniversidadeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/universidade")
public class UniversidadeController {

    private final UniversidadeService universidadeService;

    @Autowired
    public UniversidadeController(UniversidadeService universidadeService) {
        this.universidadeService = universidadeService;
    }

    @GetMapping
    public ResponseEntity<List<UniversidadeSummary>> findAll() {
        return ResponseEntity.ok(universidadeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UniversidadeSummary> findById(@PathVariable Long id) {
        return ResponseEntity.ok(universidadeService.findById(id));
    }

    @PostMapping
    public ResponseEntity<UniversidadeSummary> create(@RequestBody UniversidadeRequest request) {
        UniversidadeSummary summary = universidadeService.save(request);
        return ResponseEntity.status(201).body(summary);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UniversidadeSummary> update(@PathVariable Long id, @RequestBody UniversidadeRequest request) {
        return ResponseEntity.ok(universidadeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        universidadeService.remove(id);
        return ResponseEntity.noContent().build();
    }
}