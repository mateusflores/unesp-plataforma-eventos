package br.unesp.backend.app.dtos.checkin;

import jakarta.validation.constraints.NotBlank;

public record RegistrarCheckInRequest(
        @NotBlank(message = "Informe o código QR.")
        String codigoQR,

        @NotBlank(message = "Informe o responsável pelo check-in.")
        String responsavel
) {}
