package br.unesp.backend.app.dtos.checkin;

import br.unesp.backend.app.dtos.ingresso.IngressoEmitidoDTO;

public record CheckInResultado(
        String tipo,
        IngressoEmitidoDTO ingresso
) {}
