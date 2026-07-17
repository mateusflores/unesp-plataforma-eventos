package br.unesp.backend.app.dtos.admin;

public record CampusAdminRequest(
        String nome,
        Long universidadeId,
        String cidade,
        String estado
) {}
