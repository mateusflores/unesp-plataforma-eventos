package br.unesp.backend.app.dtos.categoria;

import br.unesp.backend.model.entities.Categoria;

public record CategoriaDTO(
        Long id,
        String nome,
        String slug,
        String cor,
        String icone
) {
    public static CategoriaDTO fromEntity(Categoria categoria) {
        return new CategoriaDTO(
                categoria.getId(),
                categoria.getNome(),
                categoria.getSlug(),
                categoria.getCor(),
                categoria.getIcone()
        );
    }
}
