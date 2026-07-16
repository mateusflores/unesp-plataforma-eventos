package br.unesp.backend.app.dtos.universidade;

import jakarta.validation.constraints.NotEmpty;

public record UniversidadeRequest(
        @NotEmpty(message = "Obrigatório informar o nome da universidade.")
        String nome
) {}