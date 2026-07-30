package br.unesp.backend.infra.config;

import java.time.DateTimeException;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public final class DateUtils {

    private static final DateTimeFormatter ISO_OFFSET = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    private DateUtils() {}

    /**
     * Aceita formatos lenientes de data/hora, preenchendo segundos e
     * timezone do sistema quando ausentes.
     */
    public static ZonedDateTime parseZonedDateTime(String value) {
        if (value == null || value.isBlank()) {
            throw new DateTimeParseException("Data não pode ser nula ou vazia", value, 0);
        }

        try {
            return ZonedDateTime.parse(value);
        } catch (DateTimeException ignored) {
            /* sem timezone */
        }
        try {
            return ZonedDateTime.parse(value, DateTimeFormatter.ISO_DATE_TIME);
        } catch (DateTimeException ignored) {
            /* formato não-ISO estrito */
        }

        String normalized = value;
        if (!value.contains("+")
                && !value.substring(Math.max(0, value.indexOf('T'))).contains("-")
                && !value.endsWith("Z")) {
            String[] parts = value.split("T");
            if (parts.length == 2 && parts[1].split(":").length == 2) {
                normalized = parts[0] + "T" + parts[1] + ":00";
            }
        }

        try {
            return ZonedDateTime.of(
                    LocalDateTime.parse(normalized),
                    ZonedDateTime.now().getZone()
            );
        } catch (DateTimeException e) {
            throw new DateTimeParseException(
                    "Formato de data inválido: \"" + value
                            + "\". Use o padrão ISO 8601 com offset (ex: 2026-08-15T14:00:00-03:00).",
                    value, 0);
        }
    }

    /**
     * Formata ZonedDateTime como ISO 8601 com offset numérico,
     * sem o sufixo de zone-id entre colchetes.
     * Ex: 2026-08-31T23:59:59-03:00
     */
    public static String formatZonedDateTime(ZonedDateTime dt) {
        if (dt == null) return null;
        return dt.format(ISO_OFFSET);
    }
}
