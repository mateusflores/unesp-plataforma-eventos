package br.unesp.backend.app.dtos;

import java.util.List;

public record PaginadoDTO<T>(
        List<T> itens,
        long total,
        int pagina,
        int porPagina
) {}
