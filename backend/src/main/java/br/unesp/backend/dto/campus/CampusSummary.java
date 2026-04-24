package br.unesp.backend.dto.campus;

import br.unesp.backend.dto.endereco.EnderecoSummary;

public record CampusSummary(
        Long id,
        String nome,
        EnderecoSummary endereco
) {}