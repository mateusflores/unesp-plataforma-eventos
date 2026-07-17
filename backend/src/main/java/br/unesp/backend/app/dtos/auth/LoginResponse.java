package br.unesp.backend.app.dtos.auth;

import br.unesp.backend.app.dtos.usuario.UsuarioDTO;

public record LoginResponse(
        String token,
        UsuarioDTO usuario
) {}
