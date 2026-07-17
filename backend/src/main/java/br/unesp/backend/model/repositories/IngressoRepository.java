package br.unesp.backend.model.repositories;

import br.unesp.backend.model.entities.Ingresso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IngressoRepository extends JpaRepository<Ingresso, Long> {
    List<Ingresso> findByEventoId(Long eventoId);
}
