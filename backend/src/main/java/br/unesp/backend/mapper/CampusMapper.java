package br.unesp.backend.mapper;

import br.unesp.backend.dto.campus.CampusRequest;
import br.unesp.backend.dto.campus.CampusSummary;
import br.unesp.backend.model.Campus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {EnderecoMapper.class})
public interface CampusMapper {

    CampusSummary toSummary(Campus campus);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "universidade", ignore = true)
    Campus toEntity(CampusRequest request);

}
