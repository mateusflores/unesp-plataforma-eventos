package br.unesp.backend.app.dtos.compra;

import java.util.List;

public record CompraRequest(
        Long usuarioId,
        Long eventoId,
        List<ItemRequest> itens,
        String cupomCodigo,
        String metodo
) {
    public record ItemRequest(Long ingressoId, Long loteId, Integer quantidade) {}
}
