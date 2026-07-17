package br.unesp.backend.app.controllers;

import br.unesp.backend.app.dtos.organizador.OrganizadorDTO;
import br.unesp.backend.model.repositories.OrganizadorRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/organizadores")
public class OrganizadorController {

    private final OrganizadorRepository organizadorRepository;

    public OrganizadorController(OrganizadorRepository organizadorRepository) {
        this.organizadorRepository = organizadorRepository;
    }

    @GetMapping
    public List<OrganizadorDTO> listar() {
        return organizadorRepository.findAll().stream()
                .map(OrganizadorDTO::fromEntity)
                .toList();
    }

    @GetMapping("/destaques")
    public List<OrganizadorDTO> destaques() {
        return organizadorRepository.findAll(
                        PageRequest.of(0, 6)
                ).stream()
                .map(OrganizadorDTO::fromEntity)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrganizadorDTO> porId(@PathVariable Long id) {
        return organizadorRepository.findById(id)
                .map(org -> ResponseEntity.ok(OrganizadorDTO.fromEntity(org)))
                .orElse(ResponseEntity.notFound().build());
    }
}
