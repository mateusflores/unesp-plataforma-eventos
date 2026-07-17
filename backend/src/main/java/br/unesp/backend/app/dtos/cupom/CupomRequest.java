package br.unesp.backend.app.dtos.cupom;

import java.math.BigDecimal;

public record CupomRequest(
        Long eventoId,
        String codigo,
        String tipo,
        BigDecimal valor,
        String validade,
        Integer quantidadeMaxima,
        Boolean ativo
) {}
