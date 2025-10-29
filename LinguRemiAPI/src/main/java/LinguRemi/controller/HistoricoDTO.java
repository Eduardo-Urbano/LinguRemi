package LinguRemi.controller;

import java.time.ZonedDateTime;

public record HistoricoDTO (
    String emailTransferencia,
    Double valorTransferencia,
    String descTransferencia
) {}
