package br.unesp.backend.repository;

import br.unesp.backend.enums.TipoUsuario;
import br.unesp.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    List<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Usuario> findByTipoUsuario(TipoUsuario tipoUsuario);

    boolean existsByNome(String nome);

    List<Usuario> findByIsAtivoTrue();

}