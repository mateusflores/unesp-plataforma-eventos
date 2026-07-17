package br.unesp.backend.model.repositories;

import br.unesp.backend.model.entities.ingressos.IngressoEmitido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.List;
import java.util.Optional;

public interface IngressoEmitidoRepository extends JpaRepository<IngressoEmitido, Long> {
    List<IngressoEmitido> findByUsuarioId(Long usuarioId);
    List<IngressoEmitido> findByEventoId(Long eventoId);
    List<IngressoEmitido> findByVendaId(Long vendaId);
    Optional<IngressoEmitido> findByCodigoQR(String codigoQR);
}
