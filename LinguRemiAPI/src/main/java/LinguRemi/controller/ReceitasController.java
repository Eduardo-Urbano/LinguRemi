package LinguRemi.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
/*
    @PostMapping("/cadastrar")
    public ResponseEntity<String> cadastrarReceita(
            @RequestParam("nome") String nome,
            @RequestParam("ingredientes") String ingredientes,
            @RequestParam("modoDePreparo") String modoDePreparo,
            @RequestParam("foto") MultipartFile foto,
            @RequestParam(value="paraProdutos", required = false)Boolean paraProdutos,//opicional
            Authentication authentication) throws IOException {

        // Cria objeto receita sem imagem
        Receitas receita = new Receitas();
        receita.setNomeReceitas(nome);
        receita.setIngredientesReceitas(ingredientes);
        receita.setModoDePreparoReceitas(modoDePreparo);
        receita.setValorReceitas(0);

        //Pega as informações do usuário logado
        String email = authentication.getName();
        String role = authentication.getAuthorities().stream().findFirst().map(a -> a.getAuthority().replace("ROLE_", "")).orElse("USER");

        receita.setAutorEmail(email);
        receita.setAutorRole(role);

        //Regra para somente ADMIN adicionar na página de produtos
        if(Boolean.TRUE.equals(paraProdutos)&& !"ADMIN".equals(role)){
            return ResponseEntity.status(403).body("Apenas ADMIN pode adicionar na página de produtos!");
        }
        receita.setParaProdutos(Boolean.TRUE.equals(paraProdutos));

        // Salva no banco (gera ID)
        Receitas receitaSalva = repR.save(receita);

        // Diretório de upload
        Path uploadPath = Paths.get(diretorioImagem);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Salva imagem
        String fileName = System.currentTimeMillis() + "_" + foto.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.write(filePath, foto.getBytes());

        // Atualiza caminho da imagem na receita
        receitaSalva.setImgReceitas("/" + diretorioImagem + fileName);
        repR.save(receitaSalva);

        return ResponseEntity.ok("Receita cadastrada com sucesso!");
    }

    @GetMapping("/produtos")
    public List<Receitas> receitasParaProdutos() {
        return repR.findByParaProdutosTrue();
    }
 */
}