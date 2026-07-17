package br.unesp.backend.app.controllers;

import br.unesp.backend.app.dtos.admin.CampusAdminRequest;
import br.unesp.backend.app.dtos.admin.CategoriaRequest;
import br.unesp.backend.app.dtos.admin.UniversidadeAdminRequest;
import br.unesp.backend.app.dtos.campus.CampusSummary;
import br.unesp.backend.app.dtos.categoria.CategoriaDTO;
import br.unesp.backend.app.dtos.universidade.UniversidadeSummary;
import br.unesp.backend.app.services.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class CatalogAdminController {

    private final AdminService adminService;

    public CatalogAdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/categorias")
    public ResponseEntity<CategoriaDTO> salvarCategoria(@Valid @RequestBody CategoriaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.salvarCategoria(request));
    }

    @PutMapping("/categorias/{id}")
    public ResponseEntity<CategoriaDTO> atualizarCategoria(@PathVariable Long id,
                                                            @Valid @RequestBody CategoriaRequest request) {
        return ResponseEntity.ok(adminService.atualizarCategoria(id, request));
    }

    @DeleteMapping("/categorias/{id}")
    public ResponseEntity<Void> removerCategoria(@PathVariable Long id) {
        adminService.removerCategoria(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/universidades")
    public ResponseEntity<UniversidadeSummary> salvarUniversidade(@Valid @RequestBody UniversidadeAdminRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.salvarUniversidade(request));
    }

    @PutMapping("/universidades/{id}")
    public ResponseEntity<UniversidadeSummary> atualizarUniversidade(@PathVariable Long id,
                                                                     @Valid @RequestBody UniversidadeAdminRequest request) {
        return ResponseEntity.ok(adminService.atualizarUniversidade(id, request));
    }

    @PostMapping("/campi")
    public ResponseEntity<CampusSummary> salvarCampus(@Valid @RequestBody CampusAdminRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.salvarCampus(request));
    }

    @PutMapping("/campi/{id}")
    public ResponseEntity<CampusSummary> atualizarCampus(@PathVariable Long id,
                                                         @Valid @RequestBody CampusAdminRequest request) {
        return ResponseEntity.ok(adminService.atualizarCampus(id, request));
    }
}
