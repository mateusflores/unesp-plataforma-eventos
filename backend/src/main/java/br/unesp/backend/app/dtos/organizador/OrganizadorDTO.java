package br.unesp.backend.app.dtos.organizador;

import br.unesp.backend.model.entities.Organizador;
import br.unesp.backend.model.enums.TipoOrganizador;

public record OrganizadorDTO(
        Long id,
        String tipo,
        String nome,
        String descricao,
        String avatarCor,
        Long usuarioId,
        EntidadeInfo entidade,
        Boolean verificado,
        Integer eventosRealizados
) {
    public record EntidadeInfo(String tipo, String emailContato) {}

    public static OrganizadorDTO fromEntity(Organizador org) {
        EntidadeInfo entidade = null;
        Long usuarioId = null;

        if (org.getTipo() == TipoOrganizador.USUARIO && org.getUsuario() != null) {
            usuarioId = org.getUsuario().getId();
        } else if (org.getTipo() == TipoOrganizador.ENTIDADE) {
            entidade = new EntidadeInfo(
                    org.getEntidadeTipo() != null ? org.getEntidadeTipo().name() : null,
                    org.getEmailContato()
            );
        }

        return new OrganizadorDTO(
                org.getId(),
                org.getTipo().name(),
                org.getNome(),
                org.getDescricao(),
                org.getAvatarCor(),
                usuarioId,
                entidade,
                org.getVerificado(),
                org.getEventosRealizados()
        );
    }
}
