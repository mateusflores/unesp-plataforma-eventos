package br.unesp.backend.model.repositories;

import br.unesp.backend.model.entities.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventoRepository extends JpaRepository<Evento, Long> {
    Optional<Evento> findBySlug(String slug);
}
