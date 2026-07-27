package br.unesp.backend.model.repositories;

import br.unesp.backend.model.entities.ingressos.Venda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VendaRepository extends JpaRepository<Venda, Long> {
    List<Venda> findByUsuarioId(Long usuarioId);
    List<Venda> findByEventoId(Long eventoId);
}
