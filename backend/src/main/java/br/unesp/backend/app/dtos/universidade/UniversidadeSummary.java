package br.unesp.backend.app.dtos.universidade;

import br.unesp.backend.model.entities.Universidade;

public record UniversidadeSummary(
        Long id,
        String nome,
        String sigla,
        String logoCor
) {
    public static UniversidadeSummary fromEntity(Universidade universidade) {
        return new UniversidadeSummary(
                universidade.getId(),
                universidade.getNome(),
                universidade.getSigla(),
                universidade.getLogoCor()
        );
    }
}
