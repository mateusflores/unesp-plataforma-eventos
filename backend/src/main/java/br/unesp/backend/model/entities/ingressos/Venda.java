package br.unesp.backend.model.entities.ingressos;

import br.unesp.backend.model.entities.Evento;
import br.unesp.backend.model.entities.Usuario;
import br.unesp.backend.model.enums.StatusVenda;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

@Entity
@Table(name = "vendas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private ZonedDateTime data;

    private BigDecimal valorTotal;

    private BigDecimal valorDesconto = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    private StatusVenda status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL,
            orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ItemVenda> itemVendaList;

    @ManyToOne
    @JoinColumn(name = "cupom_desconto_id")
    private CupomDesconto cupomDesconto;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "pagamento_id")
    private Pagamento pagamento;

}
