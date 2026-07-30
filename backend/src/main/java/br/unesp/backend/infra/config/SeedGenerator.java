package br.unesp.backend.infra.config;

import br.unesp.backend.model.entities.*;
import br.unesp.backend.model.entities.ingressos.CupomDesconto;
import br.unesp.backend.model.enums.UnidadeFederativa;
import br.unesp.backend.model.enums.UserRole;
import br.unesp.backend.model.enums.TipoOrganizador;
import br.unesp.backend.model.enums.TipoEntidade;
import br.unesp.backend.model.enums.StatusEvento;
import br.unesp.backend.model.enums.TipoDesconto;
import br.unesp.backend.model.enums.StatusInscricao;
import br.unesp.backend.model.repositories.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

@Component
@Order(1)
public class SeedGenerator implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(SeedGenerator.class);

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoriaRepository categoriaRepository;
    private final TagRepository tagRepository;
    private final UniversidadeRepository universidadeRepository;
    private final CampusRepository campusRepository;
    private final OrganizadorRepository organizadorRepository;
    private final EventoRepository eventoRepository;
    private final IngressoRepository ingressoRepository;
    private final LoteRepository loteRepository;
    private final InscricaoRepository inscricaoRepository;
    private final CupomDescontoRepository cupomRepository;

    @Value("${admin.default.password}")
    private String adminPassword;

    public SeedGenerator(UsuarioRepository usuarioRepository,
                         PasswordEncoder passwordEncoder,
                         CategoriaRepository categoriaRepository,
                         TagRepository tagRepository,
                         UniversidadeRepository universidadeRepository,
                         CampusRepository campusRepository,
                         OrganizadorRepository organizadorRepository,
                         EventoRepository eventoRepository,
                         IngressoRepository ingressoRepository,
                         LoteRepository loteRepository,
                         InscricaoRepository inscricaoRepository,
                         CupomDescontoRepository cupomRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.categoriaRepository = categoriaRepository;
        this.tagRepository = tagRepository;
        this.universidadeRepository = universidadeRepository;
        this.campusRepository = campusRepository;
        this.organizadorRepository = organizadorRepository;
        this.eventoRepository = eventoRepository;
        this.ingressoRepository = ingressoRepository;
        this.loteRepository = loteRepository;
        this.inscricaoRepository = inscricaoRepository;
        this.cupomRepository = cupomRepository;
    }

    @Override
    public void run(String... args) {
        seedAdmin();
        seedCategorias();
        seedTags();
        seedUniversidades();
        seedParticipantes();
        seedOrganizadores();
        seedEventos();
        seedInscricoes();
        seedCupons();
        log.info("Seed concluído com sucesso.");
    }

    // -----------------------------------------------------------------------
    // Admin
    // -----------------------------------------------------------------------
    private void seedAdmin() {
        if (usuarioRepository.findByEmail("admin@agora.dev").isPresent()) {
            log.info("Admin já existe, pulando...");
            return;
        }

        Usuario admin = new Usuario();
        admin.setNome("Administrador");
        admin.setEmail("admin@agora.dev");
        admin.setSenha(passwordEncoder.encode(adminPassword));
        admin.setUserRole(UserRole.ADMIN);
        admin.setIsAtivo(true);
        usuarioRepository.save(admin);
        log.info("Admin criado: admin@agora.dev");
    }

    // -----------------------------------------------------------------------
    // Categorias
    // -----------------------------------------------------------------------
    private void seedCategorias() {
        var categorias = new String[][]{
                {"Festa", "festa", "--cat-festa", "music"},
                {"Palestra", "palestra", "--cat-palestra", "book-open"},
                {"Workshop", "workshop", "--cat-workshop", "wrench"},
                {"Esportes", "esportes", "--cat-esportes", "trophy"},
                {"Arte e Cultura", "arte-cultura", "--cat-arte", "palette"},
                {"Feira", "feira", "--cat-feira", "shopping-bag"},
        };

        for (String[] c : categorias) {
            if (categoriaRepository.findAll().stream().anyMatch(cat -> cat.getNome().equals(c[0]))) {
                continue;
            }
            Categoria categoria = new Categoria();
            categoria.setNome(c[0]);
            categoria.setSlug(c[1]);
            categoria.setCor(c[2]);
            categoria.setIcone(c[3]);
            categoriaRepository.save(categoria);
        }
        log.info("Categorias semeadas.");
    }

    // -----------------------------------------------------------------------
    // Tags
    // -----------------------------------------------------------------------
    private void seedTags() {
        String[] nomes = {"presencial", "online", "gratuito", "pago", "aberto ao público", "restrito a alunos"};

        for (String nome : nomes) {
            if (tagRepository.findAll().stream().anyMatch(t -> t.getNome().equals(nome))) {
                continue;
            }
            Tag tag = new Tag();
            tag.setNome(nome);
            tagRepository.save(tag);
        }
        log.info("Tags semeadas.");
    }

    // -----------------------------------------------------------------------
    // Universidades e Campi
    // -----------------------------------------------------------------------
    private void seedUniversidades() {
        if (universidadeRepository.count() > 0) {
            log.info("Universidades já existem, pulando...");
            return;
        }

        Universidade unesp = new Universidade();
        unesp.setNome("Universidade Estadual Paulista");
        unesp.setSigla("UNESP");
        unesp.setLogoCor("#8B0000");
        unesp = universidadeRepository.save(unesp);

        Universidade usp = new Universidade();
        usp.setNome("Universidade de São Paulo");
        usp.setSigla("USP");
        usp.setLogoCor("#006400");
        usp = universidadeRepository.save(usp);

        Universidade ufscar = new Universidade();
        ufscar.setNome("Universidade Federal de São Carlos");
        ufscar.setSigla("UFSCar");
        ufscar.setLogoCor("#FF8C00");
        universidadeRepository.save(ufscar);

        // Campi UNESP - São José do Rio Preto
        Endereco end1 = new Endereco();
        end1.setLogradouro("Rua Cristóvão Colombo");
        end1.setNumero("2265");
        end1.setBairro("Jardim Nazareth");
        end1.setCidade("São José do Rio Preto");
        end1.setUf(UnidadeFederativa.SP);
        end1.setCep("15054-000");

        Campus sjrp = new Campus();
        sjrp.setNome("Campus de São José do Rio Preto");
        sjrp.setUniversidade(unesp);
        sjrp.setEndereco(end1);
        campusRepository.save(sjrp);

        // Campi UNESP - Bauru
        Endereco end2 = new Endereco();
        end2.setLogradouro("Av. Eng. Luiz Edmundo C. Coube");
        end2.setNumero("14-01");
        end2.setBairro("Vargem Limpa");
        end2.setCidade("Bauru");
        end2.setUf(UnidadeFederativa.SP);
        end2.setCep("17033-360");

        Campus bauru = new Campus();
        bauru.setNome("Campus de Bauru");
        bauru.setUniversidade(unesp);
        bauru.setEndereco(end2);
        campusRepository.save(bauru);

        // Campi USP - Ribeirão Preto
        Endereco end3 = new Endereco();
        end3.setLogradouro("Av. dos Bandeirantes");
        end3.setNumero("3900");
        end3.setBairro("Vila Monte Alegre");
        end3.setCidade("Ribeirão Preto");
        end3.setUf(UnidadeFederativa.SP);
        end3.setCep("14040-901");

        Campus ribeirao = new Campus();
        ribeirao.setNome("Campus de Ribeirão Preto");
        ribeirao.setUniversidade(usp);
        ribeirao.setEndereco(end3);
        campusRepository.save(ribeirao);

        log.info("Universidades e campi semeados.");
    }

    // -----------------------------------------------------------------------
    // Participantes (usuários comuns para testes)
    // -----------------------------------------------------------------------
    private void seedParticipantes() {
        if (usuarioRepository.findByEmail("joao@email.com").isPresent()) {
            log.info("Participantes já existem, pulando...");
            return;
        }

        List<Universidade> unis = (List<Universidade>) universidadeRepository.findAll();
        Universidade unesp = unis.stream().filter(u -> "UNESP".equals(u.getSigla())).findFirst().orElse(null);
        Universidade usp = unis.stream().filter(u -> "USP".equals(u.getSigla())).findFirst().orElse(null);
        List<Campus> campi = (List<Campus>) campusRepository.findAll();
        Campus sjrp = campi.stream().filter(c -> c.getNome().contains("São José")).findFirst().orElse(null);
        Campus bauru = campi.stream().filter(c -> c.getNome().contains("Bauru")).findFirst().orElse(null);
        Campus ribeirao = campi.stream().filter(c -> c.getNome().contains("Ribeirão")).findFirst().orElse(null);

        Usuario joao = new Usuario();
        joao.setNome("João Silva");
        joao.setEmail("joao@email.com");
        joao.setSenha(passwordEncoder.encode("123456"));
        joao.setUserRole(UserRole.PARTICIPANTE);
        joao.setIsAtivo(true);
        joao.setCurso("Ciência da Computação");
        joao.setUniversidade(unesp);
        joao.setCampus(sjrp);
        joao.setAvatarCor("#3B82F6");
        usuarioRepository.save(joao);

        Usuario maria = new Usuario();
        maria.setNome("Maria Santos");
        maria.setEmail("maria@email.com");
        maria.setSenha(passwordEncoder.encode("123456"));
        maria.setUserRole(UserRole.PARTICIPANTE);
        maria.setIsAtivo(true);
        maria.setCurso("Design");
        maria.setUniversidade(unesp);
        maria.setCampus(bauru);
        maria.setAvatarCor("#EC4899");
        usuarioRepository.save(maria);

        Usuario pedro = new Usuario();
        pedro.setNome("Pedro Oliveira");
        pedro.setEmail("pedro@email.com");
        pedro.setSenha(passwordEncoder.encode("123456"));
        pedro.setUserRole(UserRole.PARTICIPANTE);
        pedro.setIsAtivo(true);
        pedro.setCurso("Medicina");
        pedro.setUniversidade(usp);
        pedro.setCampus(ribeirao);
        pedro.setAvatarCor("#10B981");
        usuarioRepository.save(pedro);

        log.info("Participantes semeados: joao@email.com, maria@email.com, pedro@email.com (senha: 123456)");
    }

    // -----------------------------------------------------------------------
    // Organizadores
    // -----------------------------------------------------------------------
    private void seedOrganizadores() {
        if (organizadorRepository.count() > 0) {
            log.info("Organizadores já existem, pulando...");
            return;
        }

        List<Universidade> unis = (List<Universidade>) universidadeRepository.findAll();
        Universidade unesp = unis.stream().filter(u -> "UNESP".equals(u.getSigla())).findFirst().orElse(null);

        // Organizador 1 — usuário individual Lucas
        Usuario lucas = usuarioRepository.findByEmail("organizador1@email.com").orElse(null);
        if (lucas == null) {
            lucas = new Usuario();
            lucas.setNome("Lucas Almeida");
            lucas.setEmail("organizador1@email.com");
            lucas.setSenha(passwordEncoder.encode("123456"));
            lucas.setUserRole(UserRole.ORGANIZADOR);
            lucas.setIsAtivo(true);
            lucas.setCurso("Sistemas de Informação");
            lucas.setUniversidade(unesp);
            lucas.setAvatarCor("#F59E0B");
            lucas = usuarioRepository.save(lucas);
        }

        Organizador orgLucas = new Organizador();
        orgLucas.setTipo(TipoOrganizador.USUARIO);
        orgLucas.setNome("Lucas Almeida");
        orgLucas.setDescricao("Organizador de eventos acadêmicos e workshops de tecnologia no campus da UNESP.");
        orgLucas.setAvatarCor("#F59E0B");
        orgLucas.setUsuario(lucas);
        orgLucas.setVerificado(true);
        orgLucas.setEventosRealizados(3);
        organizadorRepository.save(orgLucas);

        // Organizador 2 — entidade Atlética UNESP
        Usuario atleticaUser = usuarioRepository.findByEmail("organizador2@email.com").orElse(null);
        if (atleticaUser == null) {
            atleticaUser = new Usuario();
            atleticaUser.setNome("Atlética UNESP SJRP");
            atleticaUser.setEmail("organizador2@email.com");
            atleticaUser.setSenha(passwordEncoder.encode("123456"));
            atleticaUser.setUserRole(UserRole.ORGANIZADOR);
            atleticaUser.setIsAtivo(true);
            atleticaUser.setUniversidade(unesp);
            atleticaUser.setAvatarCor("#EF4444");
            atleticaUser = usuarioRepository.save(atleticaUser);
        }

        Organizador atletica = new Organizador();
        atletica.setTipo(TipoOrganizador.ENTIDADE);
        atletica.setNome("Atlética UNESP SJRP");
        atletica.setDescricao("A Atlética da UNESP São José do Rio Preto organiza festas, campeonatos e eventos esportivos para toda a comunidade acadêmica.");
        atletica.setAvatarCor("#EF4444");
        atletica.setUsuario(atleticaUser);
        atletica.setEntidadeTipo(TipoEntidade.ATLETICA);
        atletica.setEmailContato("atletica.sjrp@unesp.br");
        atletica.setVerificado(true);
        atletica.setEventosRealizados(5);
        organizadorRepository.save(atletica);

        // Organizador 3 — entidade CACIC (Centro Acadêmico)
        Usuario cacicUser = usuarioRepository.findByEmail("organizador3@email.com").orElse(null);
        if (cacicUser == null) {
            cacicUser = new Usuario();
            cacicUser.setNome("CACIC - Centro Acadêmico");
            cacicUser.setEmail("organizador3@email.com");
            cacicUser.setSenha(passwordEncoder.encode("123456"));
            cacicUser.setUserRole(UserRole.ORGANIZADOR);
            cacicUser.setIsAtivo(true);
            cacicUser.setAvatarCor("#8B5CF6");
            cacicUser = usuarioRepository.save(cacicUser);
        }

        Organizador cacic = new Organizador();
        cacic.setTipo(TipoOrganizador.ENTIDADE);
        cacic.setNome("CACIC - Centro Acadêmico da Computação");
        cacic.setDescricao("O Centro Acadêmico de Ciência da Computação representa os alunos e organiza palestras, feiras e eventos de integração.");
        cacic.setAvatarCor("#8B5CF6");
        cacic.setUsuario(cacicUser);
        cacic.setEntidadeTipo(TipoEntidade.CENTRO_ACADEMICO);
        cacic.setEmailContato("cacic@unesp.br");
        cacic.setVerificado(true);
        cacic.setEventosRealizados(2);
        organizadorRepository.save(cacic);

        log.info("Organizadores semeados: Lucas Almeida, Atlética UNESP SJRP, CACIC (senha: 123456)");
    }

    // -----------------------------------------------------------------------
    // Eventos + Ingressos e Lotes
    // -----------------------------------------------------------------------
    private void seedEventos() {
        if (eventoRepository.count() > 0) {
            log.info("Eventos já existem, pulando...");
            return;
        }

        List<Categoria> categorias = (List<Categoria>) categoriaRepository.findAll();
        List<Tag> tags = (List<Tag>) tagRepository.findAll();
        List<Universidade> unis = (List<Universidade>) universidadeRepository.findAll();
        List<Campus> campi = (List<Campus>) campusRepository.findAll();
        List<Organizador> orgs = (List<Organizador>) organizadorRepository.findAll();

        Universidade unesp = unis.stream().filter(u -> "UNESP".equals(u.getSigla())).findFirst().orElse(null);
        Universidade usp = unis.stream().filter(u -> "USP".equals(u.getSigla())).findFirst().orElse(null);
        Campus sjrp = campi.stream().filter(c -> c.getNome().contains("São José")).findFirst().orElse(null);
        Campus bauru = campi.stream().filter(c -> c.getNome().contains("Bauru")).findFirst().orElse(null);
        Campus ribeirao = campi.stream().filter(c -> c.getNome().contains("Ribeirão")).findFirst().orElse(null);

        Organizador lucas = orgs.stream().filter(o -> "Lucas Almeida".equals(o.getNome())).findFirst().orElse(null);
        Organizador atletica = orgs.stream().filter(o -> o.getNome().contains("Atlética")).findFirst().orElse(null);
        Organizador cacic = orgs.stream().filter(o -> o.getNome().contains("CACIC")).findFirst().orElse(null);

        Categoria catPalestra = categorias.stream().filter(c -> "Palestra".equals(c.getNome())).findFirst().orElse(null);
        Categoria catFesta = categorias.stream().filter(c -> "Festa".equals(c.getNome())).findFirst().orElse(null);
        Categoria catWorkshop = categorias.stream().filter(c -> "Workshop".equals(c.getNome())).findFirst().orElse(null);
        Categoria catEsportes = categorias.stream().filter(c -> "Esportes".equals(c.getNome())).findFirst().orElse(null);
        Categoria catFeira = categorias.stream().filter(c -> "Feira".equals(c.getNome())).findFirst().orElse(null);
        Categoria catArte = categorias.stream().filter(c -> "Arte e Cultura".equals(c.getNome())).findFirst().orElse(null);

        Tag tagPresencial = tags.stream().filter(t -> "presencial".equals(t.getNome())).findFirst().orElse(null);
        Tag tagGratuito = tags.stream().filter(t -> "gratuito".equals(t.getNome())).findFirst().orElse(null);
        Tag tagPago = tags.stream().filter(t -> "pago".equals(t.getNome())).findFirst().orElse(null);
        Tag tagAberto = tags.stream().filter(t -> "aberto ao público".equals(t.getNome())).findFirst().orElse(null);

        ZonedDateTime now = ZonedDateTime.now();

        // ---------- 1. SECComp 2026 (publicado, destaque, gratuito) ----------
        Evento secComp = criarEventoBasico(
                "SECComp 2026",
                "sec-comp-2026",
                "A Semana de Computação da UNESP reúne palestras, minicursos e mesas redondas com profissionais da indústria de tecnologia. Imperdível para estudantes de computação e áreas correlatas.",
                "Palestras e minicursos com profissionais da indústria de tecnologia.",
                now.plusDays(14).withHour(8).withMinute(0).withSecond(0).withNano(0),
                now.plusDays(16).withHour(18).withMinute(0).withSecond(0).withNano(0),
                "Auditório Central",
                true, true, 200, StatusEvento.PUBLICADO,
                unesp, sjrp, lucas, catPalestra
        );
        secComp.setDestaque(true);
        secComp.setImagemCapa("https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=675&fit=crop");
        secComp.getTags().add(tagPresencial);
        secComp.getTags().add(tagGratuito);
        secComp.getTags().add(tagAberto);
        eventoRepository.save(secComp);

        // ---------- 2. Festa do Calouro (publicado, destaque, pago) ----------
        Evento festa = criarEventoBasico(
                "Festa do Calouro 2026",
                "festa-do-calouro-2026",
                "A tradicional festa de boas-vindas aos calouros! Música ao vivo, open bar de refrigerante e área de alimentação com food trucks. Traga sua carteirinha.",
                "Música ao vivo, food trucks e open bar de refrigerante.",
                now.plusDays(21).withHour(20).withMinute(0).withSecond(0).withNano(0),
                now.plusDays(22).withHour(4).withMinute(0).withSecond(0).withNano(0),
                "Centro de Convivência",
                false, true, 500, StatusEvento.PUBLICADO,
                unesp, sjrp, atletica, catFesta
        );
        festa.setDestaque(true);
        festa.setImagemCapa("https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=675&fit=crop");
        festa.getTags().add(tagPresencial);
        festa.getTags().add(tagPago);
        festa = eventoRepository.save(festa);

        Ingresso ingressoFesta = new Ingresso();
        ingressoFesta.setNome("Entrada");
        ingressoFesta.setDescricao("Acesso à área principal e food trucks.");
        ingressoFesta.setEvento(festa);
        ingressoFesta = ingressoRepository.save(ingressoFesta);

        Lote loteFesta = new Lote();
        loteFesta.setNome("1º Lote");
        loteFesta.setPreco(new BigDecimal("20.00"));
        loteFesta.setQuantidadeTotal(500);
        loteFesta.setQuantidadeDisponivel(500);
        loteFesta.setDataInicio(now);
        loteFesta.setDataFim(festa.getDataInicio());
        loteFesta.setIngresso(ingressoFesta);
        loteRepository.save(loteFesta);

        festa.setPrecoAPartir(new BigDecimal("20.00"));
        eventoRepository.save(festa);

        // ---------- 3. Workshop de React (publicado, gratuito) ----------
        Evento workshop = criarEventoBasico(
                "Workshop de React — Do Zero ao Deploy",
                "workshop-react-zero-deploy",
                "Neste workshop intensivo de 4 horas você vai aprender React desde os fundamentos até o deploy de uma aplicação real. Necessário notebook próprio.",
                "Aprenda React na prática em 4 horas. Traga seu notebook!",
                now.plusDays(7).withHour(14).withMinute(0).withSecond(0).withNano(0),
                now.plusDays(7).withHour(18).withMinute(0).withSecond(0).withNano(0),
                "Sala 12 — Bloco Didático",
                true, false, 40, StatusEvento.PUBLICADO,
                unesp, bauru, lucas, catWorkshop
        );
        workshop.setImagemCapa("https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=675&fit=crop");
        workshop.getTags().add(tagPresencial);
        workshop.getTags().add(tagGratuito);
        eventoRepository.save(workshop);

        // ---------- 4. InterUNESP (publicado, destaque, pago) ----------
        Evento inter = criarEventoBasico(
                "InterUNESP 2026",
                "interunesp-2026",
                "A maior competição esportiva entre os campi da UNESP! Participe das modalidades de futsal, vôlei, basquete, atletismo e natação.",
                "Competição esportiva entre os campi da UNESP. 5 modalidades.",
                now.plusDays(30).withHour(8).withMinute(0).withSecond(0).withNano(0),
                now.plusDays(32).withHour(18).withMinute(0).withSecond(0).withNano(0),
                "Ginásio de Esportes",
                false, true, 1000, StatusEvento.PUBLICADO,
                unesp, sjrp, atletica, catEsportes
        );
        inter.setDestaque(true);
        inter.setImagemCapa("https://images.unsplash.com/photo-1461896836934-bd45ba3fcfb5?w=1200&h=675&fit=crop");
        inter.getTags().add(tagPresencial);
        inter.getTags().add(tagPago);
        inter = eventoRepository.save(inter);

        Ingresso ingressoInter = new Ingresso();
        ingressoInter.setNome("Kit Atleta");
        ingressoInter.setDescricao("Inclui participação em até 2 modalidades.");
        ingressoInter.setEvento(inter);
        ingressoInter = ingressoRepository.save(ingressoInter);

        Lote loteInter = new Lote();
        loteInter.setNome("1º Lote");
        loteInter.setPreco(new BigDecimal("50.00"));
        loteInter.setQuantidadeTotal(1000);
        loteInter.setQuantidadeDisponivel(1000);
        loteInter.setDataInicio(now);
        loteInter.setDataFim(inter.getDataInicio().minusDays(1));
        loteInter.setIngresso(ingressoInter);
        loteRepository.save(loteInter);

        inter.setPrecoAPartir(new BigDecimal("50.00"));
        eventoRepository.save(inter);

        // ---------- 5. Feira de Profissões (publicado, gratuito) ----------
        Evento feira = criarEventoBasico(
                "Feira de Profissões 2026",
                "feira-de-profissoes-2026",
                "Alunos do ensino médio podem conhecer os cursos de graduação da USP, visitar laboratórios e conversar com professores e universitários sobre carreiras acadêmicas.",
                "Conheça os cursos de graduação da USP. Visitas guiadas aos laboratórios.",
                now.plusDays(10).withHour(9).withMinute(0).withSecond(0).withNano(0),
                now.plusDays(10).withHour(17).withMinute(0).withSecond(0).withNano(0),
                "Campus USP — Prédio Central",
                true, true, 300, StatusEvento.PUBLICADO,
                usp, ribeirao, cacic, catFeira
        );
        feira.setImagemCapa("https://images.unsplash.com/photo-1523050854058-8df90910d0f2?w=1200&h=675&fit=crop");
        feira.getTags().add(tagPresencial);
        feira.getTags().add(tagGratuito);
        feira.getTags().add(tagAberto);
        eventoRepository.save(feira);

        // ---------- 6. Hackathon Ágora (rascunho, gratuito) ----------
        Evento hackathon = criarEventoBasico(
                "Hackathon Ágora — Maratona de Inovação",
                "hackathon-agora",
                "48 horas de desenvolvimento intenso para resolver desafios reais da universidade. Forme sua equipe e venha programar com a gente!",
                "48 horas de programação. Monte sua equipe e participe!",
                now.plusDays(60).withHour(8).withMinute(0).withSecond(0).withNano(0),
                now.plusDays(62).withHour(18).withMinute(0).withSecond(0).withNano(0),
                "Laboratório de Informática — Bloco 5",
                true, false, 60, StatusEvento.RASCUNHO,
                unesp, sjrp, lucas, catWorkshop
        );
        hackathon.setImagemCapa("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=675&fit=crop");
        hackathon.getTags().add(tagPresencial);
        hackathon.getTags().add(tagGratuito);
        eventoRepository.save(hackathon);

        log.info("Eventos semeados: 6 eventos (4 publicados, 1 rascunho, 2 pagos com lotes)");
    }

    // -----------------------------------------------------------------------
    // Inscrições
    // -----------------------------------------------------------------------
    private void seedInscricoes() {
        if (inscricaoRepository.count() > 0) {
            log.info("Inscrições já existem, pulando...");
            return;
        }

        List<Usuario> participantes = usuarioRepository.findByUserRole(UserRole.PARTICIPANTE);
        if (participantes.isEmpty()) return;

        Usuario joao = participantes.stream().filter(u -> "joao@email.com".equals(u.getEmail())).findFirst().orElse(null);
        Usuario maria = participantes.stream().filter(u -> "maria@email.com".equals(u.getEmail())).findFirst().orElse(null);
        Usuario pedro = participantes.stream().filter(u -> "pedro@email.com".equals(u.getEmail())).findFirst().orElse(null);

        List<Evento> eventos = (List<Evento>) eventoRepository.findAll();
        Evento secComp = eventos.stream().filter(e -> "sec-comp-2026".equals(e.getSlug())).findFirst().orElse(null);
        Evento workshop = eventos.stream().filter(e -> e.getSlug().contains("workshop-react")).findFirst().orElse(null);
        Evento feira = eventos.stream().filter(e -> e.getSlug().contains("feira-de-profissoes")).findFirst().orElse(null);

        ZonedDateTime agora = ZonedDateTime.now();

        if (joao != null && secComp != null) criarInscricao(joao, secComp, agora);
        if (joao != null && workshop != null) criarInscricao(joao, workshop, agora);
        if (joao != null && feira != null) criarInscricao(joao, feira, agora);

        if (maria != null && secComp != null) criarInscricao(maria, secComp, agora);
        if (maria != null && workshop != null) criarInscricao(maria, workshop, agora);
        if (maria != null && feira != null) criarInscricao(maria, feira, agora);

        if (pedro != null && secComp != null) criarInscricao(pedro, secComp, agora);
        if (pedro != null && feira != null) criarInscricao(pedro, feira, agora);

        log.info("Inscrições semeadas: 7 inscrições em 3 eventos gratuitos.");
    }

    // -----------------------------------------------------------------------
    // Cupons
    // -----------------------------------------------------------------------
    private void seedCupons() {
        if (cupomRepository.count() > 0) {
            log.info("Cupons já existem, pulando...");
            return;
        }

        List<Evento> eventos = (List<Evento>) eventoRepository.findAll();
        Evento festa = eventos.stream().filter(e -> e.getSlug().contains("festa-do-calouro")).findFirst().orElse(null);
        Evento inter = eventos.stream().filter(e -> e.getSlug().contains("interunesp")).findFirst().orElse(null);

        if (festa != null) {
            CupomDesconto cupom1 = new CupomDesconto();
            cupom1.setCodigo("CALOURO10");
            cupom1.setTipoDesconto(TipoDesconto.PERCENTUAL);
            cupom1.setValor(new BigDecimal("10"));
            cupom1.setQuantidadeMaxima(200);
            cupom1.setQuantidadeUsada(0);
            cupom1.setValidade(ZonedDateTime.now().plusMonths(6));
            cupom1.setAtivo(true);
            cupom1.setEvento(festa);
            cupomRepository.save(cupom1);
        }

        if (inter != null) {
            CupomDesconto cupom2 = new CupomDesconto();
            cupom2.setCodigo("ATLETA20");
            cupom2.setTipoDesconto(TipoDesconto.PERCENTUAL);
            cupom2.setValor(new BigDecimal("20"));
            cupom2.setQuantidadeMaxima(100);
            cupom2.setQuantidadeUsada(0);
            cupom2.setValidade(ZonedDateTime.now().plusMonths(3));
            cupom2.setAtivo(true);
            cupom2.setEvento(inter);
            cupomRepository.save(cupom2);
        }

        log.info("Cupons semeados: CALOURO10 (10% off), ATLETA20 (20% off).");
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------
    private Evento criarEventoBasico(String titulo, String slug, String descricao, String resumo,
                                     ZonedDateTime inicio, ZonedDateTime fim, String local,
                                     boolean gratuito, boolean publico, int capacidade, StatusEvento status,
                                     Universidade uni, Campus campus, Organizador org, Categoria cat) {
        Evento ev = new Evento();
        ev.setTitulo(titulo);
        ev.setSlug(slug);
        ev.setDescricao(descricao);
        ev.setResumo(resumo);
        ev.setDataInicio(inicio);
        ev.setDataFim(fim);
        ev.setLocal(local);
        ev.setGratuito(gratuito);
        ev.setPublico(publico);
        ev.setCapacidade(capacidade);
        ev.setStatus(status);
        ev.setInscritos(0);
        ev.setPrecoAPartir(BigDecimal.ZERO);
        ev.setTemListaEspera(false);
        ev.setDestaque(false);
        ev.setOrganizador(org);
        ev.setUniversidade(uni);
        ev.setCampus(campus);

        Endereco end = new Endereco();
        end.setLogradouro(campus.getEndereco().getLogradouro());
        end.setNumero("s/n");
        end.setBairro(campus.getEndereco().getBairro());
        end.setCidade(campus.getEndereco().getCidade());
        end.setUf(campus.getEndereco().getUf());
        end.setCep(campus.getEndereco().getCep());
        ev.setEndereco(end);

        ev.getCategorias().add(cat);
        return ev;
    }

    private void criarInscricao(Usuario usuario, Evento evento, ZonedDateTime data) {
        Inscricao i = new Inscricao();
        i.setUsuario(usuario);
        i.setEvento(evento);
        i.setData(data);
        i.setStatus(StatusInscricao.CONFIRMADA);
        inscricaoRepository.save(i);
    }
}
