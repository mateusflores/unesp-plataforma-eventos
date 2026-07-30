package br.unesp.backend.app.dtos.ingresso;

import br.unesp.backend.app.dtos.checkin.CheckInDTO;
import br.unesp.backend.infra.config.DateUtils;
import br.unesp.backend.model.entities.ingressos.IngressoEmitido;

public record IngressoEmitidoDTO(
        Long id,
        Long compraId,
        Long itemCompraId,
        Long usuarioId,
        Long eventoId,
        String ingressoNome,
        String loteNome,
        String codigoQR,
        String status,
        String dataEmissao,
        CheckInDTO checkIn
) {
    public static IngressoEmitidoDTO fromEntity(IngressoEmitido ingresso) {
        return new IngressoEmitidoDTO(
                ingresso.getId(),
                ingresso.getVenda() != null ? ingresso.getVenda().getId() : null,
                ingresso.getItemVenda() != null ? ingresso.getItemVenda().getId() : null,
                ingresso.getUsuario() != null ? ingresso.getUsuario().getId() : null,
                ingresso.getEvento() != null ? ingresso.getEvento().getId() : null,
                ingresso.getIngressoNome(),
                ingresso.getLoteNome(),
                ingresso.getCodigoQR(),
                ingresso.getStatusIngresso().name(),
                ingresso.getDataEmissao() != null ? DateUtils.formatZonedDateTime(ingresso.getDataEmissao()) : null,
                ingresso.getCheckIn() != null ? CheckInDTO.fromEntity(ingresso.getCheckIn()) : null
        );
    }
}
