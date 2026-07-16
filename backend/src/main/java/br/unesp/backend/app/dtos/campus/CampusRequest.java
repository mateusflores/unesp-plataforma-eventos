package br.unesp.backend.app.dtos.campus;

import br.unesp.backend.app.dtos.endereco.EnderecoRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CampusRequest(
        @NotBlank(message = "Obrigatório informar o nome do Campus.")
        String nome,
        @NotNull(message = "Obrigatório informar o endereço do Campus.")
        EnderecoRequest endereco,
        @NotNull(message = "O campus deve estar associado a uma universidade.")
        Long universidadeId
) {}