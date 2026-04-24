package br.unesp.backend.dto.auth;

import br.unesp.backend.model.enums.UserRole;

public record RegisterDTO(
        String login,
        String password,
        UserRole role) {
}
