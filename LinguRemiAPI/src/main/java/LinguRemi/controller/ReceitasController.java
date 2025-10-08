package LinguRemi.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import LinguRemi.model.Receitas;
import LinguRemi.repository.ReceitasRepository;

@RestController
@RequestMapping(value = "/receitas")
public class ReceitasController {
	
	private final String diretorioImagem = "uploads/";
	
	@Autowired
	private ReceitasRepository repR;
	
	@GetMapping(value = "/todas")
	public List<Receitas> todas(){
		return repR.findAll();
	}
	/*procurar por id no url
 	@GetMapping(value = "/todas/{id}")
	public Optional<Receitas> todas(@PathVariable Long id){
		return repR.findById(id);
	}
	 */
	
	@PostMapping("/upload")
    public ResponseEntity<String> uploadImagem(
            @RequestParam("id") Long id,
            @RequestParam("imagem") MultipartFile file) throws IOException {

        Receitas receita = repR.findById(id)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada"));

        // Garante que o diretório existe
        Path uploadPath = Paths.get(diretorioImagem);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Nome do arquivo
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);

        // Salva o arquivo
        Files.write(filePath, file.getBytes());

        // Atualiza o caminho no banco
        receita.setImgReceitas("/" + diretorioImagem + fileName);
        repR.save(receita);

        return ResponseEntity.ok("Imagem salva em: " + receita.getImgReceitas());
    }
}
