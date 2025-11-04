package LinguRemi.controller;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import LinguRemi.DTO.HistoricoDTO;
import LinguRemi.DTO.ReceitaQuantidadeDTO;
import LinguRemi.model.Historico;
import LinguRemi.model.HistoricoReceita;
import LinguRemi.model.Receitas;
import LinguRemi.repository.HistoricoRepository;
import LinguRemi.repository.ReceitasRepository;
import LinguRemi.repository.UsuariosRepository;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/historico")
public class HistoricoController {
	
    @Autowired
    private HistoricoRepository historicoRepository;
    @Autowired
    private ReceitasRepository repR;
    @Autowired
    private UsuariosRepository usuariosRepository;

    
    @PostMapping("/adicionar")
    public ResponseEntity<?> adicionarHistorico(@RequestBody HistoricoDTO dto) {

        Historico historico = new Historico();
        historico.setEmailTransferencia(dto.getEmailTransferencia());
        historico.setValorTransferencia(dto.getValorTransferencia());
        historico.setDescTransferencia(dto.getDescTransferencia());
        historico.setDataTransferencia(ZonedDateTime.now());

        List<HistoricoReceita> itens = new ArrayList<>();

        for (ReceitaQuantidadeDTO rq : dto.getReceitasTransferencia()) {
            Receitas receita = repR.findById(rq.getId())
                                   .orElseThrow(() -> new RuntimeException("Receita não encontrada"));

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


    
    @GetMapping("/dados")
    public List<Historico> transações(){
    	return historicoRepository.findAll();
    }
}

