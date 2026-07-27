package br.unesp.backend.model.repositories;

import br.unesp.backend.model.entities.ingressos.CupomDesconto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CupomDescontoRepository extends JpaRepository<CupomDesconto, Long> {
    Optional<CupomDesconto> findByCodigo(String codigo);
    List<CupomDesconto> findByEventoId(Long eventoId);
}
