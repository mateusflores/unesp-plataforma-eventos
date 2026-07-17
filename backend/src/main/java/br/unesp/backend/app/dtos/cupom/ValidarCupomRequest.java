package br.unesp.backend.app.dtos.cupom;

import jakarta.validation.constraints.NotBlank;

public record ValidarCupomRequest(
        @NotBlank(message = "Informe o código do cupom.")
        String codigo,

        Long eventoId
) {}
