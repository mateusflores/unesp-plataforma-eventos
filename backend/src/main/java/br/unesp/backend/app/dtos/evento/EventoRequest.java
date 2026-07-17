package br.unesp.backend.app.dtos.evento;

import br.unesp.backend.app.dtos.ingresso.IngressoRequest;

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
        EnderecoRequest endereco,
        List<IngressoRequest> ingressos
) {
    public record EnderecoRequest(
            String logradouro,
            String numero,
            String bairro,
            String cidade,
            String estado,
            String cep,
            String complemento
    ) {}
}
