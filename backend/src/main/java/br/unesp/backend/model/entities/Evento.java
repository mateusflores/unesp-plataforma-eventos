package br.unesp.backend.model.entities;

import br.unesp.backend.model.enums.StatusEvento;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "eventos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String resumo;

    private ZonedDateTime dataInicio;

    private ZonedDateTime dataFim;

    private Integer capacidade;

    private Integer inscritos = 0;

    private Boolean publico = Boolean.TRUE;

    private Boolean gratuito = Boolean.FALSE;

    @Enumerated(EnumType.STRING)
    private StatusEvento status = StatusEvento.RASCUNHO;

    private String imagemCapa;

    private String local;

    private BigDecimal precoAPartir = BigDecimal.ZERO;

    private Boolean temListaEspera = Boolean.FALSE;

    private Boolean destaque = Boolean.FALSE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizador_id")
    private Organizador organizador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "universidade_id")
    private Universidade universidade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campus_id")
    private Campus campus;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "endereco_id")
    private Endereco endereco;

    @ManyToMany
    @JoinTable(
        name = "evento_categoria",
        joinColumns = @JoinColumn(name = "evento_id"),
        inverseJoinColumns = @JoinColumn(name = "categoria_id")
    )
    private List<Categoria> categorias = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "evento_tag",
        joinColumns = @JoinColumn(name = "evento_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();

    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Ingresso> ingressos = new ArrayList<>();
}
