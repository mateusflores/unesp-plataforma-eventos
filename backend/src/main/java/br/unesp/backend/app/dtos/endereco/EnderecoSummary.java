package br.unesp.backend.app.dtos.endereco;

import br.unesp.backend.model.enums.UnidadeFederativa;

public record EnderecoSummary(
        Long id,
        String cep,
        String cidade,
        UnidadeFederativa uf,
        String bairro,
        String numero,
        String complemento
) {
}
