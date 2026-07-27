package br.unesp.backend.app.dtos.checkin;

import br.unesp.backend.model.entities.ingressos.CheckIn;

public record CheckInDTO(
        Long id,
        Long ingressoEmitidoId,
        String dataHora,
        String responsavel
) {
    public static CheckInDTO fromEntity(CheckIn checkin) {
        return new CheckInDTO(
                checkin.getId(),
                checkin.getIngressoEmitido() != null ? checkin.getIngressoEmitido().getId() : null,
                checkin.getDataHora() != null ? checkin.getDataHora().toString() : null,
                checkin.getResponsavel()
        );
    }
}
