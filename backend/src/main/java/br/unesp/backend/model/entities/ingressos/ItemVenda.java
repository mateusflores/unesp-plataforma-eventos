package br.unesp.backend.model.entities.ingressos;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "item_venda")
@Data
public class ItemVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantidade;

    private BigDecimal valorUnitario;

    @ManyToOne
    @JoinColumn(name = "venda_id")
    private Venda venda;

}
