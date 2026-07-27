package br.unesp.backend.model.repositories;

import br.unesp.backend.model.entities.ingressos.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
}
