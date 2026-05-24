package LinguRemi.controller;

import java.util.Optional;

import LinguRemi.DTO.ProdutoDTO;
import LinguRemi.Enum.PedidoStatus;
import LinguRemi.model.Pedido;
import LinguRemi.repository.PedidoRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
	@Autowired
	private PedidoRepository pedidoRepository;

	//Exclui um usuario
	@DeleteMapping(value="/delUser")
	public ResponseEntity<String> matarUser(@RequestBody long id){
		if(!repU.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		repU.deleteById(id);
		return ResponseEntity.ok("Usuario excluido");
	}

	@PostMapping("/produtos")
	public ResponseEntity<Receitas> criarProduto(@RequestBody @Valid ProdutoDTO dto) {
		Receitas produto = new Receitas();

		produto.setNomeReceitas(dto.nome());
		produto.setDescReceitas(dto.descricao());
		produto.setValorReceitas(dto.valor());
		produto.setImgReceitas(dto.imagem());
		produto.setAvaliacaoReceitas(0.0);
		produto.setDisponivelReceitas(dto.disponivel());
		produto.setTipoquantidadeReceitas(dto.tipoQuantidade());

		repR.save(produto);

		return ResponseEntity.ok(produto);
	}

	@GetMapping("/produtos")
	public ResponseEntity<?> listarProdutos(){
		return ResponseEntity.ok(repR.findAll());
	}

	@GetMapping("/pedidos")
	public ResponseEntity<?> listarPedidos() {
		return ResponseEntity.ok(pedidoRepository.findAll());
	}

	@PutMapping("/pedidos/{id}/cancelar")
	public ResponseEntity<?> cancelarPedidoAdmin(@PathVariable Long id) {
		Optional<Pedido> pedidoOpt = pedidoRepository.findById(id);

		if (pedidoOpt.isEmpty()) {
			return ResponseEntity.notFound().build();
		}

		Pedido pedido = pedidoOpt.get();

		if (pedido.getStatus() == PedidoStatus.PAGO) {
			return ResponseEntity.badRequest().body("Pedido pago exige fluxo de reembolso");
		}

		pedido.setStatus(PedidoStatus.CANCELADO);
		pedidoRepository.save(pedido);

		return ResponseEntity.ok(pedido);
	}

	@PutMapping("/produtos/{id}")
	public ResponseEntity<Receitas> editarProduto(@PathVariable Long id, @RequestBody @Valid ProdutoDTO dto){
		Optional<Receitas> produtoExistente = repR.findById(id);

		if (produtoExistente.isEmpty()){
			return ResponseEntity.notFound().build();
		}

		Receitas produto = produtoExistente.get();

		produto.setNomeReceitas(dto.nome());
		produto.setDescReceitas(dto.descricao());
		produto.setValorReceitas(dto.valor());
		produto.setImgReceitas(dto.imagem());
		produto.setDisponivelReceitas(dto.disponivel());
		produto.setTipoquantidadeReceitas(dto.tipoQuantidade());

		repR.save(produto);

		return ResponseEntity.ok(produto);
	}
    
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
	@DeleteMapping("/produtos/{id}")
	public ResponseEntity<String> deletarProdutoPorId(@PathVariable Long id) {
		if (!repR.existsById(id)) {
			return ResponseEntity.notFound().build();
		}

		repR.deleteById(id);

		return ResponseEntity.ok("Produto apagado");
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
}
