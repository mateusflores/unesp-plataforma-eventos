package br.unesp.backend.model.ingressos;

import br.unesp.backend.model.enums.MetodoPagamento;
import br.unesp.backend.model.enums.StatusPagamento;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_pagamento", columnDefinition = "NOT NULL")
    private StatusPagamento statusPagamento;

    @Column(name = "metodo_pagamento", columnDefinition = "NOT NULL")
    private MetodoPagamento metodoPagamento;

    @Column(name = "data_pagamento")
    private ZonedDateTime dataPagamento;

    @Column(name = "data_recusado")
    private ZonedDateTime dataRecusado;

    @Column(name = "data_aprovado")
    private ZonedDateTime dataAprovado;

    @Column(name = "valor_pagamento")
    private BigDecimal valorPagamento;

    public Pagamento() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public StatusPagamento getStatusPagamento() {
        return statusPagamento;
    }

    public void setStatusPagamento(StatusPagamento statusPagamento) {
        this.statusPagamento = statusPagamento;
    }

    public MetodoPagamento getMetodoPagamento() {
        return metodoPagamento;
    }

    public void setMetodoPagamento(MetodoPagamento metodoPagamento) {
        this.metodoPagamento = metodoPagamento;
    }

    public ZonedDateTime getDataPagamento() {
        return dataPagamento;
    }

    public void setDataPagamento(ZonedDateTime dataPagamento) {
        this.dataPagamento = dataPagamento;
    }

    public ZonedDateTime getDataRecusado() {
        return dataRecusado;
    }

    public void setDataRecusado(ZonedDateTime dataRecusado) {
        this.dataRecusado = dataRecusado;
    }

    public ZonedDateTime getDataAprovado() {
        return dataAprovado;
    }

    public void setDataAprovado(ZonedDateTime dataAprovado) {
        this.dataAprovado = dataAprovado;
    }

    public BigDecimal getValorPagamento() {
        return valorPagamento;
    }

    public void setValorPagamento(BigDecimal valorPagamento) {
        this.valorPagamento = valorPagamento;
    }
}
