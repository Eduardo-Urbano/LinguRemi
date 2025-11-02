package LinguRemi.controller;

import LinguRemi.model.Receitablog;
import LinguRemi.model.Receitas;
import LinguRemi.repository.ReceitaBlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/receitaBlog")

public class ReceitasblogController {

    @Autowired
    private ReceitaBlogRepository receitaBlogRepository;

    @PostMapping("/cadastrar")
    public ResponseEntity<String> cadastrarReceita(
            @RequestParam("nomeReceitaBlog") String nomeReceitaBlog,
            @RequestParam("ingredientesReceitaBlog") String ingredientesReceitaBlog,
            @RequestParam("descricaoReceitaBlog") String descricaoReceitaBlog,
            @RequestParam("preparoReceitaBlog") String preparoReceitaBlog,
            @RequestParam("imgReceitaBlog") MultipartFile imgReceitaBlog
    ) throws IOException {

        Receitablog receita = new Receitablog();
        receita.setNomeReceitablog(nomeReceitaBlog);
        receita.setIngredientesReceitablog(ingredientesReceitaBlog);
        receita.setDescricaoReceitablog(descricaoReceitaBlog);
        receita.setPreparoReceitaBlog(preparoReceitaBlog);

        // Recupera o diretório raiz da aplicação
        String rootPath = new File(".").getAbsolutePath(); // "." é a raiz do projeto
        File uploadDir = new File(rootPath, "uploads");

        // Cria a pasta se não existir
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Caminho completo do arquivo
        File destino = new File(uploadDir, imgReceitaBlog.getOriginalFilename());
        imgReceitaBlog.transferTo(destino);

        // Salva o caminho relativo no banco (opcional)
        receita.setImgReceitablog("uploads/" + imgReceitaBlog.getOriginalFilename());

        return ResponseEntity.ok("Receita adicionada com sucesso!");
    }
}
