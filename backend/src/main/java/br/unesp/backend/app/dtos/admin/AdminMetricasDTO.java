package br.unesp.backend.app.dtos.admin;

import java.math.BigDecimal;

public record AdminMetricasDTO(
        long totalEventos,
        long eventosPublicados,
        long totalUsuarios,
        long totalOrganizadores,
        long ingressosVendidos,
        BigDecimal receita
) {}
