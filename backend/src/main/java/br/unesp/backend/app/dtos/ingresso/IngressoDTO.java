package br.unesp.backend.app.dtos.ingresso;

import br.unesp.backend.model.entities.Ingresso;

import java.util.List;

public record IngressoDTO(
        Long id,
        Long eventoId,
        String nome,
        String descricao,
        List<LoteDTO> lotes
) {
    public static IngressoDTO fromEntity(Ingresso ingresso) {
        return new IngressoDTO(
                ingresso.getId(),
                ingresso.getEvento() != null ? ingresso.getEvento().getId() : null,
                ingresso.getNome(),
                ingresso.getDescricao(),
                ingresso.getLotes() != null ?
                        ingresso.getLotes().stream().map(LoteDTO::fromEntity).toList() : List.of()
        );
    }
}
