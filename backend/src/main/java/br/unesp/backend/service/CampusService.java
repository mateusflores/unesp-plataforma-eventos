package br.unesp.backend.service;

import br.unesp.backend.dto.campus.CampusRequest;
import br.unesp.backend.dto.campus.CampusSummary;
import br.unesp.backend.mapper.CampusMapper;
import br.unesp.backend.model.Campus;
import br.unesp.backend.model.Universidade;
import br.unesp.backend.repository.CampusRepository;
import br.unesp.backend.repository.UniversidadeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CampusService {

    private final CampusRepository repository;
    private final UniversidadeRepository universidadeRepository;
    private final CampusMapper mapper;

    @Autowired
    public CampusService(CampusRepository repository, CampusMapper mapper,
                         UniversidadeRepository universidadeRepository) {
        this.repository = repository;
        this.mapper = mapper;
        this.universidadeRepository = universidadeRepository;
    }

    @Transactional
    public CampusSummary save(CampusRequest request) {
        Universidade universidade = universidadeRepository.findById(request.universidadeId())
                .orElseThrow( () -> new ResourceNotFoundException("Erro ao registrar Campus. Universidade não encontrada."));

        Campus campus = mapper.toEntity(request);
        campus.setUniversidade(universidade);
        return mapper.toSummary(repository.save(campus));
    }

    public CampusSummary findById(Long idCampus) {
        return mapper.toSummary(repository.findById(idCampus)
                .orElseThrow(() -> new ResourceNotFoundException("Nenhum campus com ID " + idCampus + " encontrado.")));
    }

}