package br.unesp.backend.app.dtos.cupom;

import br.unesp.backend.model.entities.ingressos.CupomDesconto;

import java.math.BigDecimal;

public record CupomDTO(
        Long id,
        Long eventoId,
        String codigo,
        String tipo,
        BigDecimal valor,
        String validade,
        Integer quantidadeMaxima,
        Integer quantidadeUsada,
        Boolean ativo
) {
    public static CupomDTO fromEntity(CupomDesconto cupom) {
        return new CupomDTO(
                cupom.getId(),
                cupom.getEvento() != null ? cupom.getEvento().getId() : null,
                cupom.getCodigo(),
                cupom.getTipoDesconto().name(),
                cupom.getValor(),
                cupom.getValidade() != null ? cupom.getValidade().toString() : null,
                cupom.getQuantidadeMaxima(),
                cupom.getQuantidadeUsada(),
                cupom.getAtivo()
        );
    }
}
