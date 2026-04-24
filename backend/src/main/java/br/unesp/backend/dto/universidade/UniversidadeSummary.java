package br.unesp.backend.dto.universidade;

import br.unesp.backend.dto.campus.CampusSummary;

import java.util.List;

public record UniversidadeSummary(
        Long id,
        String nome,
        List<CampusSummary> listaCampus
) {}
