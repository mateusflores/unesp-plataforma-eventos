package br.unesp.backend.app.dtos.ingresso;

import br.unesp.backend.infra.config.DateUtils;
import br.unesp.backend.model.entities.Lote;

import java.math.BigDecimal;

public record LoteDTO(
        Long id,
        Long ingressoId,
        String nome,
        BigDecimal preco,
        Integer quantidadeTotal,
        Integer quantidadeDisponivel,
        String dataInicio,
        String dataFim
) {
    public static LoteDTO fromEntity(Lote lote) {
        return new LoteDTO(
                lote.getId(),
                lote.getIngresso() != null ? lote.getIngresso().getId() : null,
                lote.getNome(),
                lote.getPreco(),
                lote.getQuantidadeTotal(),
                lote.getQuantidadeDisponivel(),
                lote.getDataInicio() != null ? DateUtils.formatZonedDateTime(lote.getDataInicio()) : null,
                lote.getDataFim() != null ? DateUtils.formatZonedDateTime(lote.getDataFim()) : null
        );
    }
}
