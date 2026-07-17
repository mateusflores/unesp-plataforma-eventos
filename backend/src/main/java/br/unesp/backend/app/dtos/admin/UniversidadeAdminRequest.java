package br.unesp.backend.app.dtos.admin;

public record UniversidadeAdminRequest(
        String nome,
        String sigla,
        String logoCor
) {}
