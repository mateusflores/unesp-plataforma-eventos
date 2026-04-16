package br.unesp.backend.service;

import br.unesp.backend.model.Campus;
import br.unesp.backend.repository.CampusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CampusService {

    private final CampusRepository campusRepository;

    @Autowired
    public CampusService(CampusRepository campusRepository) {
        this.campusRepository = campusRepository;
    }

    public List<Campus> findAll() {
        return campusRepository.findAll();
    }

    public Campus findById(Long id) {
        return campusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campus não encontrado"));
    }

    public Campus save(Campus campus) {
        return campusRepository.save(campus);
    }

    public void remove(Long id) {
        campusRepository.deleteById(id);
    }
}