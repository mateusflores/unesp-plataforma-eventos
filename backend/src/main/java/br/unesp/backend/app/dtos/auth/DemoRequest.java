package br.unesp.backend.app.dtos.auth;

import jakarta.validation.constraints.NotNull;

public record DemoRequest(
        @NotNull(message = "Informe o ID do usuário.")
        Long usuarioId
) {}
