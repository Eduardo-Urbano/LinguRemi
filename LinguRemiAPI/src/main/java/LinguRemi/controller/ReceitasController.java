package LinguRemi.controller;

import java.io.File;
import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import LinguRemi.DTO.CadastroDTO;
import LinguRemi.model.Receitablog;
import LinguRemi.model.Receitas;
import LinguRemi.repository.ReceitaBlogRepository;
import LinguRemi.repository.ReceitasRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Receitas", description = "Endpoints relacionados às receitas do blog, produtos à venda e cadastro de novas receitas")
@RestController
@RequestMapping("/receitas")


public class ReceitasController {

    @Autowired
    private ReceitasRepository repR;
    @Autowired
    private ReceitaBlogRepository repRP;
    
    @Operation(summary = "Lista todas as receitas do blog")
    @GetMapping("/todas")
    public List<Receitablog> todas() {
        return repRP.findAll(Sort.by(Sort.Direction.DESC,"dataReceitablog"));
    }

    @Operation(summary = "Busca uma receita do blog por ID")
    @GetMapping("/buscar/{id}")
    public Optional<Receitablog> findbyIdReceitablog(@PathVariable Long id) {
    	return repRP.findById(id);
    }
    
    @GetMapping("/blog4Ultimas")
    public List<Receitablog> blog4Ultimas(){
    	List<Receitablog> todas = repRP.findTop4ByOrderByDataReceitablogDesc();
    	if(todas.isEmpty()) {
    		return List.of();
    	}
    	
    	return todas;
    }
    
    @Operation(summary = "Lista todos os produtos disponíveis para venda")
    @GetMapping("/produtos")
    public List<Receitas> todasReceitas(){
    	return repR.findAll();
    }
    
    @Operation(summary = "Busca um produto por ID")
    @GetMapping("/produtos/{id}")
    public Optional<Receitas> buscarReceita(@PathVariable Long id) {
    	return repR.findById(id);
    }

    @Operation(summary = "Cadastra uma nova receita no blog com upload de imagem")
    @PostMapping("/cadastrar")
    public Receitablog cadastrarBlog(@ModelAttribute CadastroDTO dto) throws IOException {

        Receitablog receita = new Receitablog();

        String pastaUploads =
                System.getProperty("user.dir") + "/uploads/";

        File pasta = new File(pastaUploads);

        if (!pasta.exists()) {
            pasta.mkdirs();
        }

        String contentType =
                dto.getImgReceita().getContentType();

        if (
                !"image/jpeg".equals(contentType)
                        && !"image/jpg".equals(contentType)
                        && !"image/png".equals(contentType)
                        && !"image/webp".equals(contentType)
        ) {
            throw new RuntimeException(
                    "Formato de imagem inválido"
            );
        }

        String nomeOriginal =
                dto.getImgReceita().getOriginalFilename();

        String extensao =
                nomeOriginal.substring(
                        nomeOriginal.lastIndexOf(".")
                );

        String nomeArquivo =
                java.util.UUID.randomUUID() + extensao;

        String caminho =
                pastaUploads + nomeArquivo;

        dto.getImgReceita()
                .transferTo(new File(caminho));

        receita.setNomeReceitablog(
                dto.getNomeReceita()
        );

        receita.setIngredientesReceitablog(
                dto.getIngReceita()
        );

        receita.setDescricaoReceitablog(
                dto.getDescReceita()
        );

        receita.setPreparoReceitaBlog(
                dto.getPreparoReceita()
        );

        receita.setDataReceitablog(
                ZonedDateTime.now()
        );

        receita.setTempoReceitablog(
                dto.getTempoReceita()
        );

        receita.setImgReceitablog(
                "uploads/" + nomeArquivo
        );

        repRP.save(receita);

        return receita;
    }

    @Operation(summary = "Retorna receitas aleatórias para destaque na página inicial")
    @GetMapping("/aleatorios")
    public List<Receitas> receitasAleatorias(){
    	List<Receitas> todas = repR.findAll();

        if (todas.isEmpty()){
            return List.of();
        }

        Collections.shuffle(todas);

    	return todas.stream()
                .limit(4)
                .toList();
    }
}