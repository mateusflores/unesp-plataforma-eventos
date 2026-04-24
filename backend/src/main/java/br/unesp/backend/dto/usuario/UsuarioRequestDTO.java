package br.unesp.backend.dto.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioRequestDTO(
        @NotBlank(message = "Nome é obrigatório")
        String nome,
        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email deve ser válido")
        String email,
        @NotBlank(message = "Senha é obrigatória")
        @Size(min = 6, max = 128, message = "Senha deve ter entre 6 e 128 caracteres")
        String senha,
        String telefone,
        Boolean isAtivo) {
}
