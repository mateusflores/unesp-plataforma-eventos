package br.unesp.backend.repository;

import br.unesp.backend.model.Campus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampusRepository extends JpaRepository<Campus, Long> {

    List<Campus> findByUniversidadeId(Long universidadeId);

    boolean existsByUniversidadeAndNome(Long universidadeId, String nome);
}
