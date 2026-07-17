package br.unesp.backend.model.repositories;

import br.unesp.backend.model.entities.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<Tag, Long> {
}
