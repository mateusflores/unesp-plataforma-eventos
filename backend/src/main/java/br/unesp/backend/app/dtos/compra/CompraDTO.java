package br.unesp.backend.app.dtos.compra;

import br.unesp.backend.app.dtos.pagamento.PagamentoDTO;
import br.unesp.backend.infra.config.DateUtils;
import br.unesp.backend.model.entities.ingressos.Venda;

import java.math.BigDecimal;
import java.util.List;

public record CompraDTO(
        Long id,
        Long usuarioId,
        Long eventoId,
        String data,
        List<ItemCompraDTO> itens,
        Long cupomId,
        BigDecimal desconto,
        BigDecimal valorTotal,
        String status,
        PagamentoDTO pagamento
) {
    public static CompraDTO fromEntity(Venda venda) {
        return new CompraDTO(
                venda.getId(),
                venda.getUsuario().getId(),
                venda.getEvento().getId(),
                venda.getData() != null ? DateUtils.formatZonedDateTime(venda.getData()) : null,
                venda.getItemVendaList() != null ?
                        venda.getItemVendaList().stream().map(ItemCompraDTO::fromEntity).toList() : List.of(),
                venda.getCupomDesconto() != null ? venda.getCupomDesconto().getId() : null,
                venda.getValorDesconto(),
                venda.getValorTotal(),
                venda.getStatus().name(),
                venda.getPagamento() != null ? PagamentoDTO.fromEntity(venda.getPagamento()) : null
        );
    }
}
