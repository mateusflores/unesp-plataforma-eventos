package br.unesp.backend.app.mapper;

import br.unesp.backend.app.dtos.universidade.UniversidadeRequest;
import br.unesp.backend.app.dtos.universidade.UniversidadeSummary;
import br.unesp.backend.model.entities.Universidade;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {EnderecoMapper.class, CampusMapper.class})
public interface UniversidadeMapper {


    UniversidadeSummary toSummary(Universidade universidade);

    Universidade toEntity(UniversidadeRequest request);

}
