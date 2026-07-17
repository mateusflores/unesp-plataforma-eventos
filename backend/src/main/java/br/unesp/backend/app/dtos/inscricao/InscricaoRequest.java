package br.unesp.backend.app.dtos.inscricao;

import jakarta.validation.constraints.NotNull;

public record InscricaoRequest(
        @NotNull(message = "Informe o ID do usuário.")
        Long usuarioId,

        @NotNull(message = "Informe o ID do evento.")
        Long eventoId
) {}
