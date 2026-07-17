package br.unesp.backend.app.dtos.ingresso;

import java.math.BigDecimal;

public record LoteRequest(
        Long id,
        String nome,
        BigDecimal preco,
        Integer quantidadeTotal,
        Integer quantidadeDisponivel,
        String dataInicio,
        String dataFim
) {}
