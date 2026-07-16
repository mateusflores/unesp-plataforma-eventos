package br.unesp.backend.app.mapper;

import br.unesp.backend.app.dtos.endereco.EnderecoRequest;
import br.unesp.backend.app.dtos.endereco.EnderecoSummary;
import br.unesp.backend.model.enums.UnidadeFederativa;
import br.unesp.backend.model.entities.Endereco;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EnderecoMapper {

    Endereco toEndereco(EnderecoRequest request);

    EnderecoSummary toEnderecoSummary(Endereco endereco);

    default UnidadeFederativa map(String uf) {
        if (uf == null) {
            return null;
        }
        return UnidadeFederativa.valueOf(uf.toUpperCase());
    }
}
