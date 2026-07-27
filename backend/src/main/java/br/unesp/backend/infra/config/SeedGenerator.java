package br.unesp.backend.infra.config;

import br.unesp.backend.model.entities.*;
import br.unesp.backend.model.enums.UnidadeFederativa;
import br.unesp.backend.model.enums.UserRole;
import br.unesp.backend.model.repositories.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

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

    @Value("${admin.default.password}")
    private String adminPassword;

    public SeedGenerator(UsuarioRepository usuarioRepository,
                         PasswordEncoder passwordEncoder,
                         CategoriaRepository categoriaRepository,
                         TagRepository tagRepository,
                         UniversidadeRepository universidadeRepository,
                         CampusRepository campusRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.categoriaRepository = categoriaRepository;
        this.tagRepository = tagRepository;
        this.universidadeRepository = universidadeRepository;
        this.campusRepository = campusRepository;
    }

    @Override
    public void run(String... args) {
        seedAdmin();
        seedCategorias();
        seedTags();
        seedUniversidades();
        log.info("Seed concluído com sucesso.");
    }

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
}
