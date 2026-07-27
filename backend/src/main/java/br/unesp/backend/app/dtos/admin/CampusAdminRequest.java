package br.unesp.backend.app.dtos.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CampusAdminRequest(
        @NotBlank(message = "Informe o nome do campus.")
        String nome,

        @NotNull(message = "Informe a universidade.")
        Long universidadeId,

        @NotBlank(message = "Informe a cidade.")
        String cidade,

        @NotBlank(message = "Informe o estado (UF).")
        @Size(min = 2, max = 2, message = "UF deve ter 2 caracteres (ex.: SP).")
        String estado
) {}
