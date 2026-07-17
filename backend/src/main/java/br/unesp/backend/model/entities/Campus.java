package br.unesp.backend.model.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "campus")
@Data
@Builder
public class Campus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @ManyToOne
    @JoinColumn(name = "universidade_id", nullable = false)
    private Universidade universidade;

    @OneToOne(orphanRemoval = true, cascade = CascadeType.ALL)
    @JoinColumn(name = "endereco_id")
    private Endereco endereco;

}
