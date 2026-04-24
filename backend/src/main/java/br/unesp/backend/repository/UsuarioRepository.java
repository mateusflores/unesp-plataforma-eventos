package br.unesp.backend.repository;

import br.unesp.backend.model.enums.UserRole;
import br.unesp.backend.model.Usuario;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioRepository extends CrudRepository<Usuario, Long> {

    List<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Usuario> findByUserRole(UserRole userRole);

    boolean existsByNome(String nome);

    List<Usuario> findByIsAtivoTrue();

    @Query("SELECT u FROM Usuario u WHERE u.login = ?1")
    Usuario findByLogin(String login);

}