package br.unesp.backend.model.entities.ingressos;

import br.unesp.backend.model.entities.Evento;
import br.unesp.backend.model.entities.Usuario;
import br.unesp.backend.model.enums.StatusIngresso;
import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;

@Entity
@Table(name = "ingressos_emitidos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngressoEmitido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigoQR;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusIngresso statusIngresso;

    private ZonedDateTime dataEmissao;

    private String ingressoNome;

    private String loteNome;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venda_id")
    private Venda venda;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_venda_id")
    private ItemVenda itemVenda;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id")
    private Evento evento;

    @OneToOne(mappedBy = "ingressoEmitido", cascade = CascadeType.ALL)
    private CheckIn checkIn;

}
