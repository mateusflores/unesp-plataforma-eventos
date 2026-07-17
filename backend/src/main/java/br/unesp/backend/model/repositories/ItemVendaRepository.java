package br.unesp.backend.model.repositories;

import br.unesp.backend.model.entities.ingressos.ItemVenda;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemVendaRepository extends JpaRepository<ItemVenda, Long> {
}
