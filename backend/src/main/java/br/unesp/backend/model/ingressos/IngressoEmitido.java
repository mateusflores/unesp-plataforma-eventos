package br.unesp.backend.model.ingressos;

import br.unesp.backend.enums.StatusIngresso;
import br.unesp.backend.model.Usuario;
import jakarta.persistence.*;

import java.time.ZonedDateTime;

@Entity
public class IngressoEmitido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_qr")
    private String codigoQR;

    @Enumerated
    @Column(name = "status_ingresso")
    private StatusIngresso statusIngresso;

    @Column(name = "data_emissao")
    private ZonedDateTime dataEmissao;

    @Column(name = "data_checkin")
    private ZonedDateTime dataCheckIn;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigoQR() {
        return codigoQR;
    }

    public void setCodigoQR(String codigoQR) {
        this.codigoQR = codigoQR;
    }

    public StatusIngresso getStatusIngresso() {
        return statusIngresso;
    }

    public void setStatusIngresso(StatusIngresso statusIngresso) {
        this.statusIngresso = statusIngresso;
    }

    public ZonedDateTime getDataEmissao() {
        return dataEmissao;
    }

    public void setDataEmissao(ZonedDateTime dataEmissao) {
        this.dataEmissao = dataEmissao;
    }

    public ZonedDateTime getDataCheckIn() {
        return dataCheckIn;
    }

    public void setDataCheckIn(ZonedDateTime dataCheckIn) {
        this.dataCheckIn = dataCheckIn;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
