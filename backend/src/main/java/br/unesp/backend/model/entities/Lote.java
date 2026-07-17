package br.unesp.backend.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Table(name = "lotes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private BigDecimal preco = BigDecimal.ZERO;

    @Column(nullable = false)
    private Integer quantidadeTotal;

    private Integer quantidadeDisponivel;

    private ZonedDateTime dataInicio;

    private ZonedDateTime dataFim;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingresso_id", nullable = false)
    private Ingresso ingresso;
}
