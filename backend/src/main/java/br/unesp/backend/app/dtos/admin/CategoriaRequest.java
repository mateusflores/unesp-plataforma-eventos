package br.unesp.backend.app.dtos.admin;

public record CategoriaRequest(
        String nome,
        String slug,
        String cor,
        String icone
) {}
