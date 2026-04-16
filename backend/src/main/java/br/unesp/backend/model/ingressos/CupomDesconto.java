package br.unesp.backend.model.ingressos;

import br.unesp.backend.enums.TipoDesconto;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Table(name = "cupom_desconto")
public class CupomDesconto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "VARCHAR(10) NOT NULL")
    private String codigo;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_desconto", columnDefinition = "VARCHAR(10) NOT NULL")
    private TipoDesconto tipoDesconto;

    @Column(columnDefinition = "NOT NULL DEFAULT 0.0")
    private BigDecimal valor;

    @Column(name = "quantidade_maxima")
    private Integer quantidadeMaxima;

    @Column(name = "quantidade_usada")
    private Integer quantidadeUsada;

    private ZonedDateTime validade;

    public CupomDesconto() {
        this.quantidadeUsada = 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public TipoDesconto getTipoDesconto() {
        return tipoDesconto;
    }

    public void setTipoDesconto(TipoDesconto tipoDesconto) {
        this.tipoDesconto = tipoDesconto;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public Integer getQuantidadeMaxima() {
        return quantidadeMaxima;
    }

    public void setQuantidadeMaxima(Integer quantidadeMaxima) {
        this.quantidadeMaxima = quantidadeMaxima;
    }

    public Integer getQuantidadeUsada() {
        return quantidadeUsada;
    }

    public void setQuantidadeUsada(Integer quantidadeUsada) {
        this.quantidadeUsada = quantidadeUsada;
    }

    public ZonedDateTime getValidade() {
        return validade;
    }

    public void setValidade(ZonedDateTime validade) {
        this.validade = validade;
    }
}
