package br.unesp.backend.mapper;

import br.unesp.backend.dto.universidade.UniversidadeRequest;
import br.unesp.backend.dto.universidade.UniversidadeSummary;
import br.unesp.backend.model.Universidade;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {EnderecoMapper.class, CampusMapper.class})
public interface UniversidadeMapper {


    UniversidadeSummary toSummary(Universidade universidade);

    Universidade toEntity(UniversidadeRequest request);

}
