package br.unesp.backend.app.dtos.universidade;

import br.unesp.backend.app.dtos.campus.CampusSummary;

import java.util.List;

public record UniversidadeSummary(
        Long id,
        String nome,
        List<CampusSummary> listaCampus
) {}
