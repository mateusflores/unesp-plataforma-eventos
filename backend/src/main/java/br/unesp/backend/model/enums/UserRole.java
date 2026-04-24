package br.unesp.backend.model.enums;

public enum UserRole {
    ADMIN("admin"),
    ORGANIZADOR("organizador"),
    PARTICIPANTE("participante");

    private String role;

    UserRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}
