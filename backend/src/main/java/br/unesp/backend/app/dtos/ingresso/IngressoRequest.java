package br.unesp.backend.app.dtos.ingresso;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record IngressoRequest(
        Long id,

        @NotBlank(message = "Informe o nome do ingresso.")
        String nome,

        String descricao,

        @Valid List<LoteRequest> lotes
) {}
