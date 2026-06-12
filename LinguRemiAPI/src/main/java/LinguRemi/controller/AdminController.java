package LinguRemi.controller;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import LinguRemi.DTO.ProdutoDTO;
import LinguRemi.DTO.ProdutoUpdateDTO;
import LinguRemi.DTO.ProdutoUploadDTO;
import LinguRemi.Enum.PedidoStatus;
import LinguRemi.model.Pedido;
import LinguRemi.model.Receitas;
import LinguRemi.model.Usuarios;
import LinguRemi.repository.PedidoRepository;
import LinguRemi.repository.ReceitaBlogRepository;
import LinguRemi.repository.ReceitasRepository;
import LinguRemi.repository.UsuariosRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

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

	@PutMapping("/usuarios/{id}/status")
	public ResponseEntity<?> alterarStatus(@PathVariable Long id) {
	    Usuarios usuario = repU.findById(id)
	            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

	    usuario.setAtivoUsuarios(!usuario.isAtivoUsuarios());
	    repU.save(usuario);
	    return ResponseEntity.ok(
	        Map.of(
	            "message", usuario.isAtivoUsuarios()
	                ? "Usuário desbloqueado"
	                : "Usuário bloqueado",
	            "ativo", usuario.isAtivoUsuarios()
	        )
	    );
	}

	@PostMapping(value = "/produtos",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
		public ResponseEntity<Receitas> criarProduto(@ModelAttribute @Valid ProdutoUploadDTO dto) throws IOException {
		    Receitas produto = new Receitas();

		    String pastaUploads = System.getProperty("user.dir") + "/uploads/";
		    File pasta = new File(pastaUploads);

		    if (!pasta.exists()) {
		        pasta.mkdirs();
		    }

		    String nomeOriginal = dto.getImagem().getOriginalFilename();
		    String extensao = nomeOriginal.substring(nomeOriginal.lastIndexOf("."));
		    String nomeArquivo = UUID.randomUUID() + extensao;

		    dto.getImagem().transferTo(new File(pastaUploads + nomeArquivo));

		    produto.setNomeReceitas(dto.getNome());
		    produto.setDescReceitas(dto.getDescricao());
		    produto.setValorReceitas(dto.getValor());
		    produto.setImgReceitas("uploads/" + nomeArquivo);
		    produto.setAvaliacaoReceitas(0.0);
		    produto.setDisponivelReceitas(dto.getDisponivel());
		    produto.setTipoquantidadeReceitas(dto.getTipoQuantidade());
		    produto.setAtivoReceitas(true);

		    repR.save(produto);

		    return ResponseEntity.ok(produto);
		}

	@GetMapping("/produtos")
	public ResponseEntity<?> listarProdutos(){
		return ResponseEntity.ok(repR.findByAtivoReceitasTrue());
	}

	@GetMapping("/pedidos")
	public ResponseEntity<?> listarPedidos() {
		return ResponseEntity.ok(pedidoRepository.findAll());
	}
	
	@GetMapping("/todosBlog")
	public ResponseEntity<?> listarBlog() {
		return ResponseEntity.ok(repRP.findAll(Sort.by(Sort.Direction.DESC,"dataReceitablog")));
	}
	
	@GetMapping("/usuarios")
	public ResponseEntity<?> listarUsuários(){
		return ResponseEntity.ok(repU.findAll());
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
    
	@PutMapping(value="/editarReceita/{id}")
	public ResponseEntity<Map<String, String>> editarReceita(@PathVariable Long id, @RequestBody ProdutoUpdateDTO dto) {
		Optional<Receitas> rAntiga = repR.findById(id);

		if (rAntiga.isEmpty()){
			return ResponseEntity.notFound().build();
		}

		Receitas rNova = rAntiga.get();
		rNova.setNomeReceitas(dto.nomeReceitas());
		rNova.setDescReceitas(dto.descReceitas());
		rNova.setValorReceitas(dto.valorReceitas());
		rNova.setDisponivelReceitas(dto.disponivelReceitas());
		rNova.setTipoquantidadeReceitas(dto.tipoquantidadeReceitas());
		

		repR.save(rNova);

		return ResponseEntity.ok(
	            Map.of("message", "Produto alterado com sucesso")
	    );
	}
	
	//apaga receita dos produtos
	@DeleteMapping("/produtos/{id}")
	public ResponseEntity<Map<String, String>> deletarProdutoPorId(@PathVariable Long id) {
		Optional<Receitas> recOpt = repR.findById(id);
		if (recOpt.isEmpty()) {
			return ResponseEntity.notFound().build();
		}

		Receitas receita = recOpt.get();
		receita.setAtivoReceitas(false);
		repR.save(receita);

		return ResponseEntity.ok(
			    Map.of("message", "Produto desativado")
			);
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
