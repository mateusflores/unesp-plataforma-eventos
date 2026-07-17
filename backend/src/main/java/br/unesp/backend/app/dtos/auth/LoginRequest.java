package br.unesp.backend.app.dtos.auth;

public record LoginRequest(
        String email,
        String senha
) {}
