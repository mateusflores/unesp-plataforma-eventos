package br.unesp.backend.app.dtos.campus;

import br.unesp.backend.app.dtos.endereco.EnderecoSummary;

public record CampusSummary(
        Long id,
        String nome,
        EnderecoSummary endereco
) {}