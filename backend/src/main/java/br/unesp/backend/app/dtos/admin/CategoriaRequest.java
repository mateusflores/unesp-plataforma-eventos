package br.unesp.backend.app.dtos.admin;

import jakarta.validation.constraints.NotBlank;

public record CategoriaRequest(
        @NotBlank(message = "Informe o nome da categoria.")
        String nome,
        String slug,
        String cor,
        String icone
) {}
