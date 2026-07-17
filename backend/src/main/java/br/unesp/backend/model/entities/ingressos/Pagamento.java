package br.unesp.backend.model.entities.ingressos;

import br.unesp.backend.model.enums.MetodoPagamento;
import br.unesp.backend.model.enums.StatusPagamento;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Table(name = "pagamentos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPagamento statusPagamento;

    private MetodoPagamento metodoPagamento;

    private ZonedDateTime dataPagamento;

    private ZonedDateTime dataRecusado;

    private ZonedDateTime dataAprovado;

    private BigDecimal valorPagamento;

}
