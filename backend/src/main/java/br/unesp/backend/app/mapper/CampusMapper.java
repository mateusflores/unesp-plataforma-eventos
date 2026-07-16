package br.unesp.backend.app.mapper;

import br.unesp.backend.app.dtos.campus.CampusRequest;
import br.unesp.backend.app.dtos.campus.CampusSummary;
import br.unesp.backend.model.entities.Campus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {EnderecoMapper.class})
public interface CampusMapper {

    CampusSummary toSummary(Campus campus);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "universidade", ignore = true)
    Campus toEntity(CampusRequest request);

}
