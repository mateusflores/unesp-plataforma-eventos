package br.unesp.backend.app.dtos.ingresso;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record LoteRequest(
        Long id,

        @NotBlank(message = "Informe o nome do lote.")
        String nome,

        @NotNull(message = "Informe o preço do lote.")
        BigDecimal preco,

        @NotNull(message = "Informe a quantidade total.")
        @Min(value = 1, message = "A quantidade total deve ser ao menos 1.")
        Integer quantidadeTotal,

        Integer quantidadeDisponivel,
        String dataInicio,
        String dataFim
) {}
