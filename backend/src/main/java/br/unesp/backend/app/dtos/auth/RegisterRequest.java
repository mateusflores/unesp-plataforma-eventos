package br.unesp.backend.app.dtos.auth;

public record RegisterRequest(
        String nome,
        String email,
        String senha,
        String telefone
) {}
