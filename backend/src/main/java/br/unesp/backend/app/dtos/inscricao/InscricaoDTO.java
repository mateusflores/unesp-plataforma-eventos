package br.unesp.backend.app.dtos.inscricao;

import br.unesp.backend.model.entities.Inscricao;

public record InscricaoDTO(
        Long id,
        Long usuarioId,
        Long eventoId,
        String data,
        String status
) {
    public static InscricaoDTO fromEntity(Inscricao inscricao) {
        return new InscricaoDTO(
                inscricao.getId(),
                inscricao.getUsuario().getId(),
                inscricao.getEvento().getId(),
                inscricao.getData() != null ? inscricao.getData().toString() : null,
                inscricao.getStatus() != null ? inscricao.getStatus().name() : null
        );
    }
}
