package br.unesp.backend.app.dtos.endereco;

import br.unesp.backend.model.entities.Endereco;

public record EnderecoCompletoDTO(
        Long id,
        String logradouro,
        String numero,
        String bairro,
        String cidade,
        String estado,
        String cep,
        String complemento
) {
    public static EnderecoCompletoDTO fromEntity(Endereco endereco) {
        return new EnderecoCompletoDTO(
                endereco.getId(),
                endereco.getLogradouro(),
                endereco.getNumero(),
                endereco.getBairro(),
                endereco.getCidade(),
                endereco.getUf().getSigla(),
                endereco.getCep(),
                endereco.getComplemento()
        );
    }
}
