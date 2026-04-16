package br.unesp.backend.service;

import br.unesp.backend.model.Universidade;
import br.unesp.backend.repository.UniversidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UniversidadeService {

    private final UniversidadeRepository universidadeRepository;

    @Autowired
    public UniversidadeService(UniversidadeRepository universidadeRepository) {
        this.universidadeRepository = universidadeRepository;
    }

    public List<Universidade> findAll() {
        return universidadeRepository.findAll();
    }

    public Universidade findById(Long id) {
        return universidadeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Universidade não encontrada"));
    }

    public Universidade save(Universidade universidade) {
        return universidadeRepository.save(universidade);
    }

    public void remove(Long id) {
        universidadeRepository.deleteById(id);
    }
}