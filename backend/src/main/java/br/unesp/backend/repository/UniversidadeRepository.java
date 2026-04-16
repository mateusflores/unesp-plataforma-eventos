package br.unesp.backend.repository;

import br.unesp.backend.model.Universidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UniversidadeRepository extends JpaRepository<Universidade, Long> {

    List<Universidade> findByNomeContainingIgnoreCase(String nome);

    boolean existsByNome(String nome);

}