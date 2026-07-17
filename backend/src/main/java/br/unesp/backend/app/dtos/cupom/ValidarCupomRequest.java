package br.unesp.backend.app.dtos.cupom;

public record ValidarCupomRequest(
        String codigo,
        Long eventoId
) {}
