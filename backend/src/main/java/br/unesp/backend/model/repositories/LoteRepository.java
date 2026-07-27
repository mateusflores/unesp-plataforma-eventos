package br.unesp.backend.model.repositories;

import br.unesp.backend.model.entities.Lote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoteRepository extends JpaRepository<Lote, Long> {
    List<Lote> findByIngressoId(Long ingressoId);
}
