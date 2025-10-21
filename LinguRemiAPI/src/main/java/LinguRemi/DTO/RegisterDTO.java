package LinguRemi.DTO;

import LinguRemi.Enum.UserRole;

public record RegisterDTO(String nome, String email, String senha, UserRole role) {

}
