package br.unesp.backend.app.dtos.evento;

import br.unesp.backend.app.dtos.ingresso.IngressoRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record EventoRequest(
        String titulo,
        String resumo,
        String descricao,
        String imagemCapa,
        Boolean gratuito,
        Boolean publico,
        String dataInicio,
        String dataFim,
        String local,
        Long universidadeId,
        Long campusId,
        Integer capacidade,
        Long organizadorId,
        List<Long> categoriaIds,
        List<Long> tagIds,
        String status,
        @Valid EnderecoRequest endereco,
        @Valid List<IngressoRequest> ingressos
) {
    public record EnderecoRequest(
            @NotBlank(message = "Informe o logradouro.")
            String logradouro,
            String numero,
            String bairro,
            @NotBlank(message = "Informe a cidade.")
            String cidade,
            String estado,
            @NotBlank(message = "Informe o CEP.")
            String cep,
            String complemento
    ) {}
}
