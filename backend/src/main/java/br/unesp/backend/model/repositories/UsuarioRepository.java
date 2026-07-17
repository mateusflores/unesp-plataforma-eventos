package br.unesp.backend.model.repositories;

import br.unesp.backend.model.enums.UserRole;
import br.unesp.backend.model.entities.Usuario;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends CrudRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Usuario> findByUserRole(UserRole userRole);

    boolean existsByNome(String nome);

    List<Usuario> findByIsAtivoTrue();

}