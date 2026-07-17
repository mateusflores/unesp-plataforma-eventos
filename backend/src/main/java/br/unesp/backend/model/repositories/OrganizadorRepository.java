package br.unesp.backend.model.repositories;

import br.unesp.backend.model.entities.Organizador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrganizadorRepository extends JpaRepository<Organizador, Long> {
    Optional<Organizador> findByUsuarioId(Long usuarioId);
}
