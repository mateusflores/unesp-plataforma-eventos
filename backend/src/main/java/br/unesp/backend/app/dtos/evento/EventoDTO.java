package br.unesp.backend.app.dtos.evento;

import br.unesp.backend.app.dtos.endereco.EnderecoCompletoDTO;
import br.unesp.backend.app.dtos.ingresso.IngressoDTO;
import br.unesp.backend.infra.config.DateUtils;
import br.unesp.backend.model.entities.Evento;

import java.math.BigDecimal;
import java.util.List;

public record EventoDTO(
        Long id,
        String titulo,
        String slug,
        String descricao,
        String resumo,
        String dataInicio,
        String dataFim,
        Integer capacidade,
        Integer inscritos,
        Boolean publico,
        Boolean gratuito,
        String status,
        String imagemCapa,
        Long organizadorId,
        Long universidadeId,
        Long campusId,
        EnderecoCompletoDTO endereco,
        String local,
        List<Long> categoriaIds,
        List<Long> tagIds,
        List<IngressoDTO> ingressos,
        BigDecimal precoAPartir,
        Boolean temListaEspera,
        Boolean destaque
) {
    public static EventoDTO fromEntity(Evento evento) {
        return new EventoDTO(
                evento.getId(),
                evento.getTitulo(),
                evento.getSlug(),
                evento.getDescricao(),
                evento.getResumo(),
                evento.getDataInicio() != null ? DateUtils.formatZonedDateTime(evento.getDataInicio()) : null,
                evento.getDataFim() != null ? DateUtils.formatZonedDateTime(evento.getDataFim()) : null,
                evento.getCapacidade(),
                evento.getInscritos(),
                evento.getPublico(),
                evento.getGratuito(),
                evento.getStatus() != null ? evento.getStatus().name() : null,
                evento.getImagemCapa(),
                evento.getOrganizador() != null ? evento.getOrganizador().getId() : null,
                evento.getUniversidade() != null ? evento.getUniversidade().getId() : null,
                evento.getCampus() != null ? evento.getCampus().getId() : null,
                evento.getEndereco() != null ? EnderecoCompletoDTO.fromEntity(evento.getEndereco()) : null,
                evento.getLocal(),
                evento.getCategorias() != null ?
                        evento.getCategorias().stream().map(c -> c.getId()).toList() : List.of(),
                evento.getTags() != null ?
                        evento.getTags().stream().map(t -> t.getId()).toList() : List.of(),
                evento.getIngressos() != null ?
                        evento.getIngressos().stream().map(IngressoDTO::fromEntity).toList() : List.of(),
                evento.getPrecoAPartir(),
                evento.getTemListaEspera(),
                evento.getDestaque()
        );
    }
}
