package br.unesp.backend.dto.usuario;

import br.unesp.backend.enums.TipoUsuario;

public record UsuarioResponseDTO(
        Long id,
        String nome,
        String email,
        String telefone,
        Boolean isAtivo,
        TipoUsuario tipoUsuario
) {
}
