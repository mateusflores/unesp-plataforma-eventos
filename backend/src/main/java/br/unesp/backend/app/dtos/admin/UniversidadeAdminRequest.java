package br.unesp.backend.app.dtos.admin;

import jakarta.validation.constraints.NotBlank;

public record UniversidadeAdminRequest(
        @NotBlank(message = "Informe o nome da universidade.")
        String nome,

        @NotBlank(message = "Informe a sigla da universidade.")
        String sigla,

        String logoCor
) {}
