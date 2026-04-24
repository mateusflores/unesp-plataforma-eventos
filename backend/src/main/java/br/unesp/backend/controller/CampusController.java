package br.unesp.backend.controller;

import br.unesp.backend.dto.campus.CampusRequest;
import br.unesp.backend.dto.campus.CampusSummary;
import br.unesp.backend.model.Campus;
import br.unesp.backend.service.CampusService;
import jakarta.validation.Valid;
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

    @GetMapping("/{id}")
    public ResponseEntity<CampusSummary> findById(@PathVariable Long id) {
        return ResponseEntity.ok(campusService.findById(id));
    }

    @PostMapping
    public ResponseEntity<CampusSummary> save(@Valid @RequestBody CampusRequest request) {
        return ResponseEntity.status(201).body(campusService.save(request));
    }
}
