package br.unesp.backend.model.repositories;

import br.unesp.backend.model.entities.ingressos.CheckIn;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    List<CheckIn> findByIngressoEmitidoEventoId(Long eventoId);
}
