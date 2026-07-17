package br.unesp.backend.model.entities.ingressos;

import br.unesp.backend.model.enums.TipoDesconto;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Table(name = "cupons_desconto")
@Data
@Builder
public class CupomDesconto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10)
    private String codigo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TipoDesconto tipoDesconto;

    private BigDecimal valor;

    private Integer quantidadeMaxima;

    @Column(nullable = false)
    private Integer quantidadeUsada = 0;

    private ZonedDateTime validade;

}
