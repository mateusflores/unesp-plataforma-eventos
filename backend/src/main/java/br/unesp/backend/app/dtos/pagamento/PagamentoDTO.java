package br.unesp.backend.app.dtos.pagamento;

import br.unesp.backend.model.entities.ingressos.Pagamento;
import br.unesp.backend.model.enums.MetodoPagamento;

public record PagamentoDTO(
        Long id,
        String metodo,
        String status,
        String data,
        Number valor
) {
    public static PagamentoDTO fromEntity(Pagamento pagamento) {
        return new PagamentoDTO(
                pagamento.getId(),
                mapMetodoParaFront(pagamento.getMetodoPagamento()),
                pagamento.getStatusPagamento().name(),
                pagamento.getDataPagamento() != null ? pagamento.getDataPagamento().toString() : null,
                pagamento.getValorPagamento()
        );
    }

    private static String mapMetodoParaFront(MetodoPagamento metodo) {
        if (metodo == MetodoPagamento.CARTAO_CREDITO || metodo == MetodoPagamento.CARTAO_DEBITO) {
            return "CARTAO";
        }
        return metodo.name();
    }
}
