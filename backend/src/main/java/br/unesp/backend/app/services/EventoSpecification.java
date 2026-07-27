package br.unesp.backend.app.services;

import br.unesp.backend.model.entities.Evento;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class EventoSpecification {

    public static Specification<Evento> comFiltros(
            String busca, Long universidadeId, Long campusId,
            List<Long> categoriaIds, Boolean gratuito, String status,
            Long organizadorId, Boolean somenteDestaque) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (busca != null && !busca.isBlank()) {
                String pattern = "%" + busca.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("titulo")), pattern),
                        cb.like(cb.lower(root.get("descricao")), pattern),
                        cb.like(cb.lower(root.get("resumo")), pattern)
                ));
            }
            if (universidadeId != null) {
                predicates.add(cb.equal(root.get("universidade").get("id"), universidadeId));
            }
            if (campusId != null) {
                predicates.add(cb.equal(root.get("campus").get("id"), campusId));
            }
            if (categoriaIds != null && !categoriaIds.isEmpty()) {
                predicates.add(root.join("categorias").get("id").in(categoriaIds));
                query.distinct(true);
            }
            if (gratuito != null) {
                predicates.add(cb.equal(root.get("gratuito"), gratuito));
            }
            if (status != null) {
                try {
                    br.unesp.backend.model.enums.StatusEvento.valueOf(status);
                } catch (IllegalArgumentException e) {
                    return cb.disjunction();
                }
                predicates.add(cb.equal(root.get("status").as(String.class), status));
            }
            if (organizadorId != null) {
                predicates.add(cb.equal(root.get("organizador").get("id"), organizadorId));
            }
            if (somenteDestaque != null && somenteDestaque) {
                predicates.add(cb.isTrue(root.get("destaque")));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
