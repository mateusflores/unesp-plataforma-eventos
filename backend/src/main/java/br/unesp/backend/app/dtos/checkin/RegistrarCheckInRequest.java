package br.unesp.backend.app.dtos.checkin;

public record RegistrarCheckInRequest(
        String codigoQR,
        String responsavel
) {}
