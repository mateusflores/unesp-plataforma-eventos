package br.unesp.backend.model.entities.ingressos;

import br.unesp.backend.model.enums.StatusIngresso;
import br.unesp.backend.model.entities.Usuario;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;

@Entity
@Table(name = "ingressos_emitidos")
@Data
public class IngressoEmitido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigoQR;

    @Enumerated
    @Column(nullable = false)
    private StatusIngresso statusIngresso;

    private ZonedDateTime dataEmissao;

    private ZonedDateTime dataCheckIn;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

}
