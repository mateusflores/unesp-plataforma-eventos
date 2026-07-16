package br.unesp.backend.app.dtos.auth;

import br.unesp.backend.model.enums.UserRole;

public record RegisterDTO(
        String login,
        String password,
        UserRole role) {
}
