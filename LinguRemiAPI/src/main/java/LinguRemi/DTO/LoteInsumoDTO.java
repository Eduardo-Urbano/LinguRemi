package LinguRemi.DTO;

import java.time.LocalDate;

public record LoteInsumoDTO(
    Double quantidade,
    LocalDate dataValidade
) {}