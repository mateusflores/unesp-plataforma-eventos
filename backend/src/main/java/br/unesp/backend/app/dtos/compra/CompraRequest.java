package br.unesp.backend.app.dtos.compra;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CompraRequest(
        @NotNull(message = "Informe o ID do usuário.")
        Long usuarioId,

        @NotNull(message = "Informe o ID do evento.")
        Long eventoId,

        @NotEmpty(message = "Informe ao menos um ingresso.")
        @Valid List<ItemRequest> itens,

        String cupomCodigo,

        @NotBlank(message = "Informe o método de pagamento.")
        String metodo
) {
    public record ItemRequest(
            @NotNull(message = "Informe o ingresso.")
            Long ingressoId,

            @NotNull(message = "Informe o lote.")
            Long loteId,

            @NotNull(message = "Informe a quantidade.")
            @Min(value = 1, message = "A quantidade mínima é 1.")
            Integer quantidade
    ) {}
}
