package br.unesp.backend.mapper;

import br.unesp.backend.dto.endereco.EnderecoRequest;
import br.unesp.backend.dto.endereco.EnderecoSummary;
import br.unesp.backend.model.enums.UnidadeFederativa;
import br.unesp.backend.model.Endereco;
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
