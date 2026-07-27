package br.unesp.backend.app.dtos.usuario;

import br.unesp.backend.model.entities.Usuario;
import br.unesp.backend.model.enums.UserRole;

import java.util.List;

public record UsuarioDTO(
        Long id,
        String nome,
        String email,
        String telefone,
        UserRole tipo,
        Boolean ativo,
        String avatarCor,
        Long universidadeId,
        Long campusId,
        String curso,
        List<Long> entidadesIds
) {
    public static UsuarioDTO fromEntity(Usuario usuario) {
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTelefone(),
                usuario.getUserRole(),
                usuario.getIsAtivo(),
                usuario.getAvatarCor(),
                usuario.getUniversidade() != null ? usuario.getUniversidade().getId() : null,
                usuario.getCampus() != null ? usuario.getCampus().getId() : null,
                usuario.getCurso(),
                null
        );
    }
}
