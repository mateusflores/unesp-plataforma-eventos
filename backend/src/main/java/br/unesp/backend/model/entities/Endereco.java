package br.unesp.backend.model.entities;

import br.unesp.backend.model.enums.UnidadeFederativa;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "endereco")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String logradouro;

    private String cep;

    private String cidade;

    @Enumerated(EnumType.STRING)
    private UnidadeFederativa uf;

    private String bairro;

    private String numero;

    private String complemento;

}
