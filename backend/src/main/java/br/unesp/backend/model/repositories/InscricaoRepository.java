package br.unesp.backend.model.repositories;

import br.unesp.backend.model.entities.Inscricao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InscricaoRepository extends JpaRepository<Inscricao, Long> {
    List<Inscricao> findByUsuarioId(Long usuarioId);
    List<Inscricao> findByEventoId(Long eventoId);
    Optional<Inscricao> findByUsuarioIdAndEventoId(Long usuarioId, Long eventoId);
}
