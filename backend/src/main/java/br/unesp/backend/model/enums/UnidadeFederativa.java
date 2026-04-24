package br.unesp.backend.model.enums;

public enum UnidadeFederativa {
    AC("Acre"),
    AL("Alagoas"),
    AP("Amapá"),
    AM("Amazonas"),
    BA("Bahia"),
    CE("Ceará"),
    DF("Distrito Federal"),
    ES("Espírito Santo"),
    GO("Goiás"),
    MA("Maranhão"),
    MT("Mato Grosso"),
    MS("Mato Grosso do Sul"),
    MG("Minas Gerais"),
    PA("Pará"),
    PB("Paraíba"),
    PR("Paraná"),
    PE("Pernambuco"),
    PI("Piauí"),
    RJ("Rio de Janeiro"),
    RN("Rio Grande do Norte"),
    RS("Rio Grande do Sul"),
    RO("Rondônia"),
    RR("Roraima"),
    SC("Santa Catarina"),
    SP("São Paulo"),
    SE("Sergipe"),
    TO("Tocantins");

    private final String nome;

    UnidadeFederativa(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }

    public String getSigla() {
        return this.name();
    }

    public static UnidadeFederativa fromSigla(String sigla) {
        if (sigla == null || sigla.trim().isEmpty()) {
            throw new IllegalArgumentException("A sigla não pode ser nula ou vazia.");
        }
        for (UnidadeFederativa uf : UnidadeFederativa.values()) {
            if (uf.name().equalsIgnoreCase(sigla.trim())) {
                return uf;
            }
        }
        throw new IllegalArgumentException("Nenhuma Unidade Federativa encontrada para a sigla: " + sigla);
    }
}