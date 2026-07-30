package br.unesp.backend.app.services;

import br.unesp.backend.app.dtos.admin.*;
import br.unesp.backend.app.dtos.campus.CampusSummary;
import br.unesp.backend.app.dtos.categoria.CategoriaDTO;
import br.unesp.backend.app.dtos.universidade.UniversidadeSummary;
import br.unesp.backend.app.dtos.usuario.UsuarioDTO;
import br.unesp.backend.model.entities.*;
import br.unesp.backend.model.enums.UserRole;
import br.unesp.backend.model.enums.*;
import br.unesp.backend.model.repositories.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AdminService {

    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final UniversidadeRepository universidadeRepository;
    private final CampusRepository campusRepository;
    private final EventoRepository eventoRepository;
    private final IngressoEmitidoRepository ingressoEmitidoRepository;
    private final VendaRepository vendaRepository;

    public AdminService(UsuarioRepository usuarioRepository,
                        CategoriaRepository categoriaRepository,
                        UniversidadeRepository universidadeRepository,
                        CampusRepository campusRepository,
                        EventoRepository eventoRepository,
                        IngressoEmitidoRepository ingressoEmitidoRepository,
                        VendaRepository vendaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.categoriaRepository = categoriaRepository;
        this.universidadeRepository = universidadeRepository;
        this.campusRepository = campusRepository;
        this.eventoRepository = eventoRepository;
        this.ingressoEmitidoRepository = ingressoEmitidoRepository;
        this.vendaRepository = vendaRepository;
    }

    // --- Usuários ---

    public List<UsuarioDTO> usuarios() {
        return ((List<Usuario>) usuarioRepository.findAll()).stream()
                .map(UsuarioDTO::fromEntity)
                .toList();
    }

    @Transactional
    public UsuarioDTO alternarUsuarioAtivo(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        usuario.setIsAtivo(!Boolean.TRUE.equals(usuario.getIsAtivo()));
        usuario = usuarioRepository.save(usuario);
        return UsuarioDTO.fromEntity(usuario);
    }

    @Transactional
    public UsuarioDTO promoverUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        if (usuario.getUserRole() == UserRole.ORGANIZADOR) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Usuário já é organizador.");
        }
        if (usuario.getUserRole() == UserRole.ADMIN) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Administradores não podem ser promovidos.");
        }

        usuario.setUserRole(UserRole.ORGANIZADOR);
        usuario = usuarioRepository.save(usuario);
        return UsuarioDTO.fromEntity(usuario);
    }

    @Transactional
    public void removerUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    // --- Categorias ---

    public List<CategoriaDTO> listarCategorias() {
        return categoriaRepository.findAll().stream()
                .map(CategoriaDTO::fromEntity)
                .toList();
    }

    @Transactional
    public CategoriaDTO salvarCategoria(CategoriaRequest request) {
        return CategoriaDTO.fromEntity(
                criarOuAtualizarCategoria(null, request));
    }

    @Transactional
    public CategoriaDTO atualizarCategoria(Long id, CategoriaRequest request) {
        return CategoriaDTO.fromEntity(
                criarOuAtualizarCategoria(id, request));
    }

    @Transactional
    public void removerCategoria(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada");
        }
        categoriaRepository.deleteById(id);
    }

    private Categoria criarOuAtualizarCategoria(Long id, CategoriaRequest request) {
        Categoria categoria;
        if (id != null) {
            categoria = categoriaRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));
        } else {
            categoria = new Categoria();
        }
        if (request.nome() != null) categoria.setNome(request.nome());
        if (request.slug() != null) categoria.setSlug(request.slug());
        if (request.cor() != null) categoria.setCor(request.cor());
        if (request.icone() != null) categoria.setIcone(request.icone());
        return categoriaRepository.save(categoria);
    }

    // --- Universidades ---

    @Transactional
    public UniversidadeSummary salvarUniversidade(UniversidadeAdminRequest request) {
        return UniversidadeSummary.fromEntity(
                criarOuAtualizarUniversidade(null, request));
    }

    @Transactional
    public UniversidadeSummary atualizarUniversidade(Long id, UniversidadeAdminRequest request) {
        return UniversidadeSummary.fromEntity(
                criarOuAtualizarUniversidade(id, request));
    }

    private Universidade criarOuAtualizarUniversidade(Long id, UniversidadeAdminRequest request) {
        Universidade u;
        if (id != null) {
            u = universidadeRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Universidade não encontrada"));
        } else {
            u = new Universidade();
        }
        if (request.nome() != null) u.setNome(request.nome());
        if (request.sigla() != null) u.setSigla(request.sigla());
        if (request.logoCor() != null) u.setLogoCor(request.logoCor());
        return universidadeRepository.save(u);
    }

    // --- Campi ---

    @Transactional
    public CampusSummary salvarCampus(CampusAdminRequest request) {
        return CampusSummary.fromEntity(criarCampus(request));
    }

    @Transactional
    public CampusSummary atualizarCampus(Long id, CampusAdminRequest request) {
        return CampusSummary.fromEntity(atualizarCampusEntity(id, request));
    }

    private Campus criarCampus(CampusAdminRequest request) {
        Universidade universidade = universidadeRepository.findById(request.universidadeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Universidade não encontrada"));

        UnidadeFederativa uf;
        try {
            uf = UnidadeFederativa.fromSigla(request.estado());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "UF inválida: " + request.estado());
        }

        Endereco endereco = new Endereco();
        endereco.setCidade(request.cidade());
        endereco.setUf(uf);

        Campus campus = new Campus();
        campus.setNome(request.nome());
        campus.setUniversidade(universidade);
        campus.setEndereco(endereco);
        return campusRepository.save(campus);
    }

    private Campus atualizarCampusEntity(Long id, CampusAdminRequest request) {
        Campus campus = campusRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Campus não encontrado"));

        if (request.nome() != null) campus.setNome(request.nome());
        if (request.universidadeId() != null) {
            Universidade u = universidadeRepository.findById(request.universidadeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Universidade não encontrada"));
            campus.setUniversidade(u);
        }
        if (request.cidade() != null || request.estado() != null) {
            Endereco endereco = campus.getEndereco();
            if (endereco == null) endereco = new Endereco();
            if (request.cidade() != null) endereco.setCidade(request.cidade());
            if (request.estado() != null) {
                try {
                    endereco.setUf(UnidadeFederativa.fromSigla(request.estado()));
                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "UF inválida: " + request.estado());
                }
            }
            campus.setEndereco(endereco);
        }
        return campusRepository.save(campus);
    }

    // --- Métricas ---

    public AdminMetricasDTO metricas() {
        long totalEventos = eventoRepository.count();
        long eventosPublicados = eventoRepository.findAll().stream()
                .filter(e -> e.getStatus() == StatusEvento.PUBLICADO)
                .count();
        long totalUsuarios = usuarioRepository.count();
        long totalOrganizadores = usuarioRepository.findByUserRole(UserRole.ORGANIZADOR).size();
        long ingressosVendidos = ingressoEmitidoRepository.count();
        BigDecimal receita = vendaRepository.findAll().stream()
                .filter(v -> v.getStatus() == StatusVenda.PAGO)
                .map(v -> v.getValorTotal() != null ? v.getValorTotal() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new AdminMetricasDTO(
                totalEventos, eventosPublicados, totalUsuarios,
                totalOrganizadores, ingressosVendidos, receita);
    }
}
