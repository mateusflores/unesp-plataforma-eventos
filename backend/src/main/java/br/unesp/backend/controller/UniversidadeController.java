package br.unesp.backend.controller;

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
    public ResponseEntity<List<Universidade>> findAll() {
        return ResponseEntity.ok(universidadeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Universidade> findById(@PathVariable Long id) {
        return ResponseEntity.ok(universidadeService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Universidade> create(@RequestBody Universidade universidade) {
        Universidade criada = universidadeService.save(universidade);
        return ResponseEntity.status(201).body(criada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Universidade> update(@PathVariable Long id, @RequestBody Universidade universidade) {
        universidade.setId(id);
        return ResponseEntity.ok(universidadeService.save(universidade));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        universidadeService.remove(id);
        return ResponseEntity.noContent().build();
    }
}