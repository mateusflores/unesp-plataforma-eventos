package br.unesp.backend.dto.endereco;

import br.unesp.backend.enums.UnidadeFederativa;

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
