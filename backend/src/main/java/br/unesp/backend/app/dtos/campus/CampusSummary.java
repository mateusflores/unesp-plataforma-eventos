package br.unesp.backend.app.dtos.campus;

import br.unesp.backend.model.entities.Campus;

public record CampusSummary(
        Long id,
        Long universidadeId,
        String nome,
        String cidade,
        String estado
) {
    public static CampusSummary fromEntity(Campus campus) {
        return new CampusSummary(
                campus.getId(),
                campus.getUniversidade().getId(),
                campus.getNome(),
                campus.getEndereco() != null ? campus.getEndereco().getCidade() : null,
                campus.getEndereco() != null ? campus.getEndereco().getUf().getSigla() : null
        );
    }
}
