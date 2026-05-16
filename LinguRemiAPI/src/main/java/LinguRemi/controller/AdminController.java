package LinguRemi.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import LinguRemi.DTO.ReceitaQuantidadeDTO;
import LinguRemi.model.Receitas;
import LinguRemi.repository.ReceitaBlogRepository;
import LinguRemi.repository.ReceitasRepository;
import LinguRemi.repository.UsuariosRepository;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "admin", description = "Endpoints relacionados ao gerenciamento de usuários e controle de produtos cadastrados")
@RestController
@RequestMapping(value = "/admin")
public class AdminController {

	@Autowired
	private UsuariosRepository repU;
	@Autowired
    private ReceitasRepository repR;
    @Autowired
    private ReceitaBlogRepository repRP;
    
	@PutMapping(value="/qtd")
	public ResponseEntity<Receitas> mudarQtd(@RequestBody ReceitaQuantidadeDTO dto) {
		Optional<Receitas> rAntiga = repR.findById(dto.getId());

		if (rAntiga.isEmpty()){
			return ResponseEntity.notFound().build();
		}

		Receitas rNova = rAntiga.get();
		rNova.setDisponivelReceitas(dto.getQuantidade());
		repR.save(rNova);

		return ResponseEntity.ok(rNova);
	}
	
	//apaga receita dos produtos
	@DeleteMapping(value="/delProduto")
	public ResponseEntity<String> apagarProduto(@RequestBody long id){
		if(!repR.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		repR.deleteById(id);
		return ResponseEntity.ok("Produto Apagado");
	}
	
	//apaga receita do blog
	@DeleteMapping(value="/delReceita")
	public ResponseEntity<String> apagarReceitaBlog(@RequestBody long id){
		if(!repRP.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		repRP.deleteById(id);
		return ResponseEntity.ok("Receita Apagada do blog");
	}
	
	//Exclui um usuario
	@DeleteMapping(value="/delUser")
	public ResponseEntity<String> matarUser(@RequestBody long id){
		if(!repU.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		repU.deleteById(id);
		return ResponseEntity.ok("Usuario excluido");
	}
	
	
}
