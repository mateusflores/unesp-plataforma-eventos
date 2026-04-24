package br.unesp.backend.service;

import br.unesp.backend.dto.universidade.UniversidadeRequest;
import br.unesp.backend.dto.universidade.UniversidadeSummary;
import br.unesp.backend.mapper.UniversidadeMapper;
import br.unesp.backend.model.Universidade;
import br.unesp.backend.repository.UniversidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UniversidadeService {

    private final UniversidadeRepository universidadeRepository;
    private final UniversidadeMapper mapper;

    @Autowired
    public UniversidadeService(UniversidadeRepository universidadeRepository, UniversidadeMapper mapper) {
        this.universidadeRepository = universidadeRepository;
        this.mapper = mapper;
    }

    public List<UniversidadeSummary> findAll() {
        return universidadeRepository.findAll().stream().map(mapper::toSummary).toList();
    }

    public UniversidadeSummary findById(Long id) {
        Universidade universidade = universidadeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Universidade não encontrada"));
        return mapper.toSummary(universidade);
    }

    public UniversidadeSummary save(UniversidadeRequest request) {
        Universidade universidade = mapper.toEntity(request);
        return mapper.toSummary(universidadeRepository.save(universidade));
    }

    public UniversidadeSummary update(Long idUniversidade, UniversidadeRequest request) {
        Universidade universidade = universidadeRepository.findById(idUniversidade)
                .orElseThrow( () -> new ResourceNotFoundException("Universidade com ID "
                        + idUniversidade + " não encontrada"));
        universidade.setNome(request.nome());
        return mapper.toSummary(universidadeRepository.save(universidade));
    }

    public void remove(Long id) {
        universidadeRepository.deleteById(id);
    }
}