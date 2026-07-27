package br.unesp.backend.app.dtos.cupom;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CupomRequest(
        Long eventoId,

        @NotBlank(message = "Informe o código do cupom.")
        String codigo,

        @NotBlank(message = "Informe o tipo de desconto (PERCENTUAL ou VALOR_FIXO).")
        String tipo,

        @NotNull(message = "Informe o valor do desconto.")
        BigDecimal valor,

        String validade,

        @Min(value = 1, message = "A quantidade máxima deve ser ao menos 1.")
        Integer quantidadeMaxima,

        Boolean ativo
) {}
