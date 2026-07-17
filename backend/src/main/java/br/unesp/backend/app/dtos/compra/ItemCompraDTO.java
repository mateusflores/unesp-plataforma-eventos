package br.unesp.backend.app.dtos.compra;

import br.unesp.backend.model.entities.ingressos.ItemVenda;

import java.math.BigDecimal;

public record ItemCompraDTO(
        Long id,
        Long ingressoId,
        Long loteId,
        String descricao,
        Integer quantidade,
        BigDecimal valorUnitario
) {
    public static ItemCompraDTO fromEntity(ItemVenda item) {
        return new ItemCompraDTO(
                item.getId(),
                item.getIngresso() != null ? item.getIngresso().getId() : null,
                item.getLote() != null ? item.getLote().getId() : null,
                item.getDescricao(),
                item.getQuantidade(),
                item.getValorUnitario()
        );
    }
}
