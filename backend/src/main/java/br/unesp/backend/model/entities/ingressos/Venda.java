package br.unesp.backend.model.entities.ingressos;

import br.unesp.backend.model.enums.StatusVenda;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

@Entity
@Table(name = "vendas")
@Data
@Builder
public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private ZonedDateTime data;

    private BigDecimal valorTotal;

    private BigDecimal valorDesconto = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    private StatusVenda status;

    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL,
            orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ItemVenda> itemVendaList;

    @ManyToOne
    @JoinColumn(name = "cupom_desconto_id")
    private CupomDesconto cupomDesconto;

    @OneToOne
    @JoinColumn(name = "pagamento_id")
    private Pagamento pagamento;

}
