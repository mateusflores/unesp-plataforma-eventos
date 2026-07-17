package br.unesp.backend.app.services;

import br.unesp.backend.app.dtos.evento.EventoDTO;
import br.unesp.backend.app.dtos.evento.EventoRequest;
import br.unesp.backend.app.dtos.ingresso.IngressoRequest;
import br.unesp.backend.app.dtos.ingresso.LoteRequest;
import br.unesp.backend.model.entities.*;
import br.unesp.backend.model.enums.StatusEvento;
import br.unesp.backend.model.enums.UnidadeFederativa;
import br.unesp.backend.model.repositories.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.DateTimeException;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class EventoService {

    private final EventoRepository eventoRepository;
    private final OrganizadorRepository organizadorRepository;
    private final UniversidadeRepository universidadeRepository;
    private final CampusRepository campusRepository;
    private final CategoriaRepository categoriaRepository;
    private final TagRepository tagRepository;
    private final IngressoRepository ingressoRepository;
    private final LoteRepository loteRepository;

    public EventoService(EventoRepository eventoRepository,
                         OrganizadorRepository organizadorRepository,
                         UniversidadeRepository universidadeRepository,
                         CampusRepository campusRepository,
                         CategoriaRepository categoriaRepository,
                         TagRepository tagRepository,
                         IngressoRepository ingressoRepository,
                         LoteRepository loteRepository) {
        this.eventoRepository = eventoRepository;
        this.organizadorRepository = organizadorRepository;
        this.universidadeRepository = universidadeRepository;
        this.campusRepository = campusRepository;
        this.categoriaRepository = categoriaRepository;
        this.tagRepository = tagRepository;
        this.ingressoRepository = ingressoRepository;
        this.loteRepository = loteRepository;
    }

    public Page<Evento> listar(String busca, Long universidadeId, Long campusId,
                               List<Long> categoriaIds, Boolean gratuito, String status,
                               Long organizadorId, Boolean somenteDestaque, int pagina, int porPagina) {
        var spec = EventoSpecification.comFiltros(busca, universidadeId, campusId,
                categoriaIds, gratuito, status, organizadorId, somenteDestaque);
        return eventoRepository.findAll(spec, PageRequest.of(pagina - 1, porPagina));
    }

    public List<Evento> destaques() {
        return eventoRepository.findByDestaqueTrue();
    }

    public Evento porSlug(String slug) {
        return eventoRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado: " + slug));
    }

    public Evento porId(Long id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado: " + id));
    }

    public List<Evento> porOrganizador(Long organizadorId) {
        return eventoRepository.findByOrganizadorId(organizadorId);
    }

    @Transactional
    public Evento criar(EventoRequest request) {
        Evento evento = new Evento();
        aplicarRequest(evento, request);
        evento.setStatus(StatusEvento.RASCUNHO);
        if (request.status() != null) {
            try {
                evento.setStatus(StatusEvento.valueOf(request.status()));
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status inválido: " + request.status());
            }
        }
        evento.setSlug(gerarSlug(request.titulo()));
        evento.setInscritos(0);
        evento.setPrecoAPartir(BigDecimal.ZERO);
        evento = eventoRepository.save(evento);
        salvarIngressos(evento, request.ingressos());
        return eventoRepository.findById(evento.getId()).orElse(evento);
    }

    @Transactional
    public Evento atualizar(Long id, EventoRequest request) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado: " + id));
        aplicarRequest(evento, request);
        if (request.status() != null) {
            try {
                evento.setStatus(StatusEvento.valueOf(request.status()));
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status inválido: " + request.status());
            }
        }
        evento.getIngressos().clear();
        eventoRepository.flush();
        salvarIngressos(evento, request.ingressos());
        return eventoRepository.findById(id).orElse(evento);
    }

    @Transactional
    public void publicar(Long id) {
        Evento evento = porId(id);
        if (evento.getTitulo() == null || evento.getTitulo().isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "O título do evento é obrigatório para publicação.");
        }
        if (evento.getDataInicio() == null) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "A data de início é obrigatória para publicação.");
        }
        if (evento.getOrganizador() == null) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "O organizador é obrigatório para publicação.");
        }
        evento.setStatus(StatusEvento.PUBLICADO);
        eventoRepository.save(evento);
    }

    @Transactional
    public void cancelar(Long id) {
        Evento evento = porId(id);
        evento.setStatus(StatusEvento.CANCELADO);
        eventoRepository.save(evento);
    }

    @Transactional
    public Evento duplicar(Long id) {
        Evento original = porId(id);
        Evento copia = new Evento();
        copia.setTitulo(original.getTitulo() + " (cópia)");
        copia.setSlug(gerarSlug(copia.getTitulo()));
        copia.setDescricao(original.getDescricao());
        copia.setResumo(original.getResumo());
        copia.setDataInicio(original.getDataInicio());
        copia.setDataFim(original.getDataFim());
        copia.setCapacidade(original.getCapacidade());
        copia.setInscritos(0);
        copia.setPublico(original.getPublico());
        copia.setGratuito(original.getGratuito());
        copia.setStatus(StatusEvento.RASCUNHO);
        copia.setImagemCapa(original.getImagemCapa());
        copia.setLocal(original.getLocal());
        copia.setPrecoAPartir(original.getPrecoAPartir());
        copia.setTemListaEspera(original.getTemListaEspera());
        copia.setDestaque(false);
        copia.setOrganizador(original.getOrganizador());
        copia.setUniversidade(original.getUniversidade());
        copia.setCampus(original.getCampus());
        if (original.getEndereco() != null) {
            Endereco endOriginal = original.getEndereco();
            Endereco endCopia = new Endereco();
            endCopia.setLogradouro(endOriginal.getLogradouro());
            endCopia.setNumero(endOriginal.getNumero());
            endCopia.setBairro(endOriginal.getBairro());
            endCopia.setCidade(endOriginal.getCidade());
            endCopia.setUf(endOriginal.getUf());
            endCopia.setCep(endOriginal.getCep());
            endCopia.setComplemento(endOriginal.getComplemento());
            copia.setEndereco(endCopia);
        }
        copia.setCategorias(original.getCategorias() != null
                ? new ArrayList<>(original.getCategorias()) : new ArrayList<>());
        copia.setTags(original.getTags() != null
                ? new ArrayList<>(original.getTags()) : new ArrayList<>());
        copia = eventoRepository.save(copia);
        if (original.getIngressos() != null) {
            for (Ingresso ingOriginal : original.getIngressos()) {
                Ingresso ingCopia = new Ingresso();
                ingCopia.setNome(ingOriginal.getNome());
                ingCopia.setDescricao(ingOriginal.getDescricao());
                ingCopia.setEvento(copia);
                ingCopia = ingressoRepository.save(ingCopia);
                if (ingOriginal.getLotes() != null) {
                    for (Lote loteOriginal : ingOriginal.getLotes()) {
                        Lote loteCopia = new Lote();
                        loteCopia.setNome(loteOriginal.getNome());
                        loteCopia.setPreco(loteOriginal.getPreco());
                        loteCopia.setQuantidadeTotal(loteOriginal.getQuantidadeTotal());
                        loteCopia.setQuantidadeDisponivel(loteOriginal.getQuantidadeTotal());
                        loteCopia.setDataInicio(loteOriginal.getDataInicio());
                        loteCopia.setDataFim(loteOriginal.getDataFim());
                        loteCopia.setIngresso(ingCopia);
                        loteRepository.save(loteCopia);
                    }
                }
            }
        }
        return eventoRepository.findById(copia.getId()).orElse(copia);
    }

    private void aplicarRequest(Evento evento, EventoRequest request) {
        if (request.titulo() != null) {
            evento.setTitulo(request.titulo());
            evento.setSlug(gerarSlug(request.titulo()));
        }
        if (request.resumo() != null) evento.setResumo(request.resumo());
        if (request.descricao() != null) evento.setDescricao(request.descricao());
        if (request.imagemCapa() != null) evento.setImagemCapa(request.imagemCapa());
        if (request.gratuito() != null) evento.setGratuito(request.gratuito());
        if (request.publico() != null) evento.setPublico(request.publico());
        if (request.dataInicio() != null) {
            try {
                evento.setDataInicio(ZonedDateTime.parse(request.dataInicio()));
            } catch (DateTimeException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Formato de data inválido para dataInicio: " + request.dataInicio());
            }
        }
        if (request.dataFim() != null) {
            try {
                evento.setDataFim(ZonedDateTime.parse(request.dataFim()));
            } catch (DateTimeException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Formato de data inválido para dataFim: " + request.dataFim());
            }
        }
        if (request.local() != null) evento.setLocal(request.local());
        if (request.capacidade() != null) evento.setCapacidade(request.capacidade());

        if (request.organizadorId() != null) {
            evento.setOrganizador(organizadorRepository.findById(request.organizadorId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organizador não encontrado")));
        }
        if (request.universidadeId() != null) {
            evento.setUniversidade(universidadeRepository.findById(request.universidadeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Universidade não encontrada")));
        }
        if (request.campusId() != null) {
            evento.setCampus(campusRepository.findById(request.campusId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Campus não encontrado")));
        }

        if (request.endereco() != null) {
            Endereco end = new Endereco();
            var req = request.endereco();
            if (req.logradouro() != null) end.setLogradouro(req.logradouro());
            if (req.numero() != null) end.setNumero(req.numero());
            if (req.bairro() != null) end.setBairro(req.bairro());
            if (req.cidade() != null) end.setCidade(req.cidade());
            if (req.cep() != null) end.setCep(req.cep());
            if (req.complemento() != null) end.setComplemento(req.complemento());
            if (req.estado() != null) {
                try {
                    end.setUf(UnidadeFederativa.fromSigla(req.estado()));
                } catch (IllegalArgumentException e) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "UF inválida: " + req.estado());
                }
            }
            evento.setEndereco(end);
        }

        if (request.categoriaIds() != null) {
            List<Categoria> categorias = categoriaRepository.findAllById(request.categoriaIds());
            evento.setCategorias(categorias);
        }
        if (request.tagIds() != null) {
            List<Tag> tags = tagRepository.findAllById(request.tagIds());
            evento.setTags(tags);
        }
    }

    private void salvarIngressos(Evento evento, List<IngressoRequest> ingressosRequest) {
        if (ingressosRequest == null) return;
        for (IngressoRequest ir : ingressosRequest) {
            Ingresso ingresso = new Ingresso();
            ingresso.setNome(ir.nome());
            ingresso.setDescricao(ir.descricao());
            ingresso.setEvento(evento);
            ingresso = ingressoRepository.save(ingresso);
            if (ir.lotes() != null) {
                for (LoteRequest lr : ir.lotes()) {
                    Lote lote = new Lote();
                    lote.setNome(lr.nome());
                    lote.setPreco(lr.preco() != null ? lr.preco() : BigDecimal.ZERO);
                    lote.setQuantidadeTotal(lr.quantidadeTotal() != null ? lr.quantidadeTotal() : 0);
                    lote.setQuantidadeDisponivel(lr.quantidadeDisponivel() != null ?
                            lr.quantidadeDisponivel() : lote.getQuantidadeTotal());
                    if (lr.dataInicio() != null) {
                        try { lote.setDataInicio(ZonedDateTime.parse(lr.dataInicio())); }
                        catch (DateTimeException e) {
                            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                    "Formato de data inválido para lote: " + lr.dataInicio());
                        }
                    }
                    if (lr.dataFim() != null) {
                        try { lote.setDataFim(ZonedDateTime.parse(lr.dataFim())); }
                        catch (DateTimeException e) {
                            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                    "Formato de data inválido para lote: " + lr.dataFim());
                        }
                    }
                    lote.setIngresso(ingresso);
                    loteRepository.save(lote);
                }
            }
        }
        recalcularPrecoAPartir(evento);
    }

    private void recalcularPrecoAPartir(Evento evento) {
        BigDecimal minPreco = eventoRepository.findById(evento.getId())
                .orElse(evento).getIngressos().stream()
                .flatMap(i -> i.getLotes().stream())
                .map(Lote::getPreco)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);
        evento.setPrecoAPartir(minPreco);
        eventoRepository.save(evento);
    }

    public static String gerarSlug(String titulo) {
        if (titulo == null) return null;
        return titulo.toLowerCase()
                .replaceAll("[^a-z0-9áéíóúãõâêôàç\\s]", "")
                .trim()
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }
}
