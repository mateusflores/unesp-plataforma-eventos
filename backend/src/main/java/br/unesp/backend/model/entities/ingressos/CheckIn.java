package br.unesp.backend.model.entities.ingressos;

import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;

@Entity
@Table(name = "check_ins")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "ingresso_emitido_id", nullable = false)
    private IngressoEmitido ingressoEmitido;

    private ZonedDateTime dataHora;

    private String responsavel;
}
