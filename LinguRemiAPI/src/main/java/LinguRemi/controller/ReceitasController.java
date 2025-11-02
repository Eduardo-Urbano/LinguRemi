package LinguRemi.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import LinguRemi.model.Receitablog;
import LinguRemi.model.Receitas;
import LinguRemi.repository.ReceitaBlogRepository;
import LinguRemi.repository.ReceitasRepository;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/receitas")


public class ReceitasController {

    private final String diretorioImagem = "uploads/";

    @Autowired
    private ReceitasRepository repR;
    @Autowired
    private ReceitaBlogRepository repRP;
    
    @GetMapping("/todas")
    public List<Receitablog> todas() {
        return repRP.findAll();
    }

    @GetMapping("/buscar/{id}")
    public Optional<Receitablog> findbyIdReceitablog(@PathVariable Long id) {
    	return repRP.findById(id);
    }
    
    @GetMapping("/produtos")
    public List<Receitas> todasReceitas(){
    	return repR.findAll();
    }
    
    @GetMapping("/produtos/{id}")
    public Optional<Receitas> buscarReceita(@PathVariable Long id) {
    	return repR.findById(id);
    }
}