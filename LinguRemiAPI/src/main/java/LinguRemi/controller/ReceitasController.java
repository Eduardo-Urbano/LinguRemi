package LinguRemi.controller;

import java.io.File;
import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.CrossOrigin;
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

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/receitas")


public class ReceitasController {

    private final String diretorioImagem = "uploads/";

    @Autowired
    private ReceitasRepository repR;
    @Autowired
    private ReceitaBlogRepository repRP;
    
    //receitas do blog // // // // // // // // // // // // //
    @GetMapping("/todas")
    public List<Receitablog> todas() {
        return repRP.findAll(Sort.by(Sort.Direction.DESC,"dataReceitablog"));
    }

    @GetMapping("/buscar/{id}")
    public Optional<Receitablog> findbyIdReceitablog(@PathVariable Long id) {
    	return repRP.findById(id);
    }
    
    //receitas a venda // // // // // // // // // // // // //
    @GetMapping("/produtos")
    public List<Receitas> todasReceitas(){
    	return repR.findAll();
    }
    
    @GetMapping("/produtos/{id}")
    public Optional<Receitas> buscarReceita(@PathVariable Long id) {
    	return repR.findById(id);
    }
    
    @PostMapping("/cadastrar")
    public Receitablog cadastrarBlog(@ModelAttribute CadastroDTO dto) throws IOException {
        Receitablog receita = new Receitablog();


        String pastaUploads = System.getProperty("user.dir") + "/uploads/";
        String caminho = pastaUploads + dto.getImgReceita().getOriginalFilename();
        dto.getImgReceita().transferTo(new File(caminho));
        
        receita.setNomeReceitablog(dto.getNomeReceita());
        receita.setIngredientesReceitablog(dto.getIngReceita());
        receita.setDescricaoReceitablog(dto.getDescReceita());
        receita.setPreparoReceitaBlog(dto.getPreparoReceita());
        receita.setDataReceitablog(ZonedDateTime.now());
        receita.setTempoReceitablog(dto.getTempoReceita());
        receita.setImgReceitablog("uploads/" + dto.getImgReceita().getOriginalFilename());
        repRP.save(receita);

        return receita;
    }

    @GetMapping("/aleatorios")
    public List<Receitas> receitasAleatorias(){
    	Random gen = new Random();
    	Long total = repR.count();
    	List<Receitas> lista = new ArrayList<>();
    	
    	for(int i=0;i<3;i++) {
    		Long recAle = 1 + gen.nextLong(total);
    		repR.findById(recAle).ifPresent(lista::add);
    	}
    	return lista;
    }
}