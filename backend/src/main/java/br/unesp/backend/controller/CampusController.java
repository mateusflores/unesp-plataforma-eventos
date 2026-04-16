package br.unesp.backend.controller;

import br.unesp.backend.model.Campus;
import br.unesp.backend.service.CampusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campus")
public class CampusController {

    private final CampusService campusService;

    @Autowired
    public CampusController(CampusService campusService) {
        this.campusService = campusService;
    }

    @GetMapping
    public ResponseEntity<List<Campus>> findAll() {
        return ResponseEntity.ok(campusService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Campus> findById(@PathVariable Long id) {
        return ResponseEntity.ok(campusService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Campus> save(@RequestBody Campus campus) {
        Campus criado = campusService.save(campus);
        return ResponseEntity.status(201).body(criado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Campus> update(@PathVariable Long id, @RequestBody Campus campus) {
        campus.setId(id);
        return ResponseEntity.ok(campusService.save(campus));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        campusService.remove(id);
        return ResponseEntity.noContent().build();
    }
}
