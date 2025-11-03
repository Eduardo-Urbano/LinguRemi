package LinguRemi.controller;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import LinguRemi.model.Historico;
import LinguRemi.repository.HistoricoRepository;
import LinguRemi.repository.UsuariosRepository;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/historico")
public class HistoricoController {
	
    @Autowired
    private HistoricoRepository historicoRepository;

    @Autowired
    private UsuariosRepository usuariosRepository;

    
    /*
    @PostMapping("/adicionar")
    public ResponseEntity<?> adicionarHistorico(@RequestBody HistoricoDTO dto) {
        Historico historico = new Historico();
        historico.setEmailTransferencia(dto.emailTransferencia());
        historico.setValorTransferencia(dto.valorTransferencia());
        historico.setDataTransferencia(ZonedDateTime.now());
        historico.setDescTransferencia(dto.descTransferencia());

        historicoRepository.save(historico);

        return ResponseEntity.ok(historico);
    }
    */
    
    @GetMapping("/dados")
    public List<Historico> transações(){
    	return historicoRepository.findAll();
    }
}

