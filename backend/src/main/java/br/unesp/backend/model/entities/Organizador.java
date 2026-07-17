package br.unesp.backend.model.entities;

import br.unesp.backend.model.enums.TipoEntidade;
import br.unesp.backend.model.enums.TipoOrganizador;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "organizadores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organizador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoOrganizador tipo;

    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String avatarCor;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    private TipoEntidade entidadeTipo;

    private String emailContato;

    private Boolean verificado = Boolean.FALSE;

    private Integer eventosRealizados = 0;
}
