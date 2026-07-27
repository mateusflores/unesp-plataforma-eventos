package br.unesp.backend.app.controllers;

import br.unesp.backend.app.dtos.campus.CampusSummary;
import br.unesp.backend.app.dtos.categoria.CategoriaDTO;
import br.unesp.backend.app.dtos.tag.TagDTO;
import br.unesp.backend.app.dtos.universidade.UniversidadeSummary;
import br.unesp.backend.model.repositories.CampusRepository;
import br.unesp.backend.model.repositories.CategoriaRepository;
import br.unesp.backend.model.repositories.TagRepository;
import br.unesp.backend.model.repositories.UniversidadeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CatalogController {

    private final UniversidadeRepository universidadeRepository;
    private final CampusRepository campusRepository;
    private final CategoriaRepository categoriaRepository;
    private final TagRepository tagRepository;

    public CatalogController(UniversidadeRepository universidadeRepository,
                             CampusRepository campusRepository,
                             CategoriaRepository categoriaRepository,
                             TagRepository tagRepository) {
        this.universidadeRepository = universidadeRepository;
        this.campusRepository = campusRepository;
        this.categoriaRepository = categoriaRepository;
        this.tagRepository = tagRepository;
    }

    @GetMapping("/universidades")
    public List<UniversidadeSummary> listarUniversidades() {
        return universidadeRepository.findAll().stream()
                .map(UniversidadeSummary::fromEntity)
                .toList();
    }

    @GetMapping("/campi")
    public List<CampusSummary> listarCampi(@RequestParam(required = false) Long universidadeId) {
        if (universidadeId != null) {
            return campusRepository.findByUniversidadeId(universidadeId).stream()
                    .map(CampusSummary::fromEntity)
                    .toList();
        }
        return campusRepository.findAll().stream()
                .map(CampusSummary::fromEntity)
                .toList();
    }

    @GetMapping("/categorias")
    public List<CategoriaDTO> listarCategorias() {
        return categoriaRepository.findAll().stream()
                .map(CategoriaDTO::fromEntity)
                .toList();
    }

    @GetMapping("/tags")
    public List<TagDTO> listarTags() {
        return tagRepository.findAll().stream()
                .map(TagDTO::fromEntity)
                .toList();
    }
}
