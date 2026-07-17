package br.unesp.backend.app.dtos.ingresso;

import java.util.List;

public record IngressoRequest(
        Long id,
        String nome,
        String descricao,
        List<LoteRequest> lotes
) {}
