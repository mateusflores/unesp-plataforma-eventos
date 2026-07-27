package br.unesp.backend.model.repositories;

import br.unesp.backend.model.entities.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface EventoRepository extends JpaRepository<Evento, Long>, JpaSpecificationExecutor<Evento> {
    Optional<Evento> findBySlug(String slug);
    List<Evento> findByOrganizadorId(Long organizadorId);
    List<Evento> findByDestaqueTrue();
}
