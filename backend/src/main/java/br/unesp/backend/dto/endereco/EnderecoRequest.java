package br.unesp.backend.dto.endereco;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Length;

public record EnderecoRequest(
        @NotBlank()
        @Pattern(regexp = "^\\d{2}\\d{3}[-]\\d{3}$", message = "Informe um CEP válido.")
        String cep,
        @NotBlank(message = "Obrigatório informar a cidade.")
        String cidade,
        @NotBlank(message = "Obrigatório informar UF.")
        @Length(min = 2, max = 2, message = "Informe a sigla da UF corretamente.")
        String uf,
        @NotBlank(message = "Obrigatório informar o bairro.")
        String bairro,
        @NotBlank(message = "Obrigatório informar o número do endereço.")
        String numero,
        String complemento
) {
}
