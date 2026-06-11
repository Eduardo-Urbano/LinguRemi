package LinguRemi.controller;

import LinguRemi.DTO.HistoricoDTO;
import LinguRemi.DTO.HistoricoResponseDTO;
import LinguRemi.DTO.ReceitaQuantidadeDTO;
import LinguRemi.model.Historico;
import LinguRemi.model.HistoricoReceita;
import LinguRemi.model.Receitas;
import LinguRemi.model.Usuarios;
import LinguRemi.repository.HistoricoRepository;
import LinguRemi.repository.ReceitasRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Tag(name = "Histórico", description = "Endpoints relacionados ao histórico de transações e compras")
@RestController
@RequestMapping("/historico")
public class HistoricoController {
	
    @Autowired
    private HistoricoRepository historicoRepository;
    @Autowired
    private ReceitasRepository repR;
    private static final Logger logger =
            LoggerFactory.getLogger(HistoricoController.class);

    @Operation(summary = "Adiciona uma nova transação ao histórico")
    @PostMapping("/adicionar")
    public ResponseEntity<?> adicionarHistorico(@Valid @RequestBody HistoricoDTO dto, @AuthenticationPrincipal Usuarios usuario) {

        Historico historico = new Historico();
        historico.setEmailTransferencia(usuario.getEmailUsuarios());
        historico.setValorTransferencia(dto.getValorTransferencia());
        historico.setDescTransferencia(dto.getDescTransferencia());
        historico.setDataTransferencia(ZonedDateTime.now());

        List<HistoricoReceita> itens = new ArrayList<>();

        for (ReceitaQuantidadeDTO rq : dto.getReceitasTransferencia()) {
            Receitas receita = repR.findById(rq.getId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Receita não encontrada"));

            HistoricoReceita item = new HistoricoReceita();
            item.setHistorico(historico);
            item.setReceita(receita);
            item.setQuantidade(rq.getQuantidade());

            itens.add(item);
        }

        historico.setItens(itens);

        historicoRepository.save(historico);

        return ResponseEntity.ok(historico);
    }

    @Operation(summary = "Lista todas as transações registradas")
    @GetMapping("/dados")
    public List<HistoricoResponseDTO> transacoes(
            @AuthenticationPrincipal Usuarios usuario
    ) {
        return historicoRepository
                .findByEmailTransferencia(
                        usuario.getEmailUsuarios()
                )
                .stream()
                .map(h -> new HistoricoResponseDTO(
                        h.getIdHistorico(),
                        h.getItens()
                                .get(0)
                                .getReceita()
                                .getNomeReceitas(),
                        h.getValorTransferencia(),
                        h.getDataTransferencia()
                ))
                .toList();
    }
}

