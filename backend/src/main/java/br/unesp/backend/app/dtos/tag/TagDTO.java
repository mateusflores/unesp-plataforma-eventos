package br.unesp.backend.app.dtos.tag;

import br.unesp.backend.model.entities.Tag;

public record TagDTO(
        Long id,
        String nome
) {
    public static TagDTO fromEntity(Tag tag) {
        return new TagDTO(tag.getId(), tag.getNome());
    }
}
