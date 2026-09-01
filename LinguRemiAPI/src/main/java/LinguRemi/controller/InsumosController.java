package LinguRemi.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import LinguRemi.DTO.InsumoDTO;
import LinguRemi.DTO.LoteInsumoDTO;
import LinguRemi.DTO.MovimentacaoDTO;
import LinguRemi.DTO.ReceitaInsumoDTO;
import LinguRemi.model.Insumo;
import LinguRemi.model.LoteInsumo;
import LinguRemi.model.MovimentacaoEstoque;
import LinguRemi.model.ReceitaInsumo;
import LinguRemi.model.Receitas;
import LinguRemi.repository.InsumoRepository;
import LinguRemi.repository.LoteInsumoRepository;
import LinguRemi.repository.MovimentacaoEstoqueRepository;
import LinguRemi.repository.ReceitaInsumoRepository;
import LinguRemi.repository.ReceitasRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "insumos", description = "Endpoints relacionados ao controle de insumos, lotes, validade e redução de desperdício")
@RestController
@RequestMapping(value = "/admin")
public class InsumosController {

    @Autowired
    private InsumoRepository repI;
    @Autowired
    private LoteInsumoRepository repL;
    @Autowired
    private ReceitaInsumoRepository repRI;
    @Autowired
    private MovimentacaoEstoqueRepository repM;
    @Autowired
    private ReceitasRepository repR;

    // =====================================================
    // INSUMOS
    // =====================================================

    @PostMapping("/insumos")
    public ResponseEntity<Insumo> criarInsumo(@RequestBody @Valid InsumoDTO dto) {
        Insumo insumo = new Insumo();
        insumo.setNomeInsumo(dto.nomeInsumo());
        insumo.setUnidadeMedida(dto.unidadeMedida());
        insumo.setEstoqueAtual(0.0);
        insumo.setEstoqueMinimo(dto.estoqueMinimo());
        insumo.setCustoUnitario(dto.custoUnitario());
        insumo.setAtivoInsumo(true);

        repI.save(insumo);

        return ResponseEntity.ok(insumo);
    }

    @GetMapping("/insumos")
    public ResponseEntity<?> listarInsumos() {
        return ResponseEntity.ok(repI.findByAtivoInsumoTrue());
    }

    @GetMapping("/insumos/baixoEstoque")
    public ResponseEntity<?> listarInsumosBaixoEstoque() {
        // Compara estoqueAtual <= estoqueMinimo de cada insumo ativo,
        // reaproveitando o mesmo padrão de alerta usado em disponivelReceitas
        List<Insumo> ativos = repI.findByAtivoInsumoTrue();
        List<Insumo> baixoEstoque = ativos.stream()
            .filter(i -> i.getEstoqueAtual() <= i.getEstoqueMinimo())
            .toList();

        return ResponseEntity.ok(baixoEstoque);
    }

    @PutMapping("/insumos/{id}")
    public ResponseEntity<Insumo> editarInsumo(@PathVariable Long id, @RequestBody @Valid InsumoDTO dto) {
        Optional<Insumo> insumoExistente = repI.findById(id);

        if (insumoExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Insumo insumo = insumoExistente.get();
        insumo.setNomeInsumo(dto.nomeInsumo());
        insumo.setUnidadeMedida(dto.unidadeMedida());
        insumo.setEstoqueMinimo(dto.estoqueMinimo());
        insumo.setCustoUnitario(dto.custoUnitario());

        repI.save(insumo);

        return ResponseEntity.ok(insumo);
    }

    @DeleteMapping("/insumos/{id}")
    public ResponseEntity<Map<String, String>> desativarInsumo(@PathVariable Long id) {
        Optional<Insumo> insumoOpt = repI.findById(id);

        if (insumoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Insumo insumo = insumoOpt.get();
        insumo.setAtivoInsumo(false);
        repI.save(insumo);

        return ResponseEntity.ok(Map.of("message", "Insumo desativado"));
    }

    // =====================================================
    // LOTES (entrada de estoque + rastreio de validade)
    // =====================================================

    @PostMapping("/insumos/{id}/lotes")
    public ResponseEntity<LoteInsumo> criarLote(@PathVariable Long id, @RequestBody @Valid LoteInsumoDTO dto) {
        Insumo insumo = repI.findById(id)
            .orElseThrow(() -> new RuntimeException("Insumo não encontrado"));

        LoteInsumo lote = new LoteInsumo();
        lote.setInsumo(insumo);
        lote.setQuantidadeInicial(dto.quantidade());
        lote.setQuantidadeAtual(dto.quantidade());
        lote.setDataEntrada(LocalDate.now());
        lote.setDataValidade(dto.dataValidade());
        repL.save(lote);

        // Atualiza o saldo agregado do insumo
        insumo.setEstoqueAtual(insumo.getEstoqueAtual() + dto.quantidade());
        repI.save(insumo);

        // Registra a movimentação para auditoria
        MovimentacaoEstoque mov = new MovimentacaoEstoque();
        mov.setInsumo(insumo);
        mov.setLote(lote);
        mov.setTipoMovimentacao("ENTRADA");
        mov.setQuantidade(dto.quantidade());
        mov.setDataMovimentacao(LocalDateTime.now());
        repM.save(mov);

        return ResponseEntity.ok(lote);
    }

    @GetMapping("/insumos/{id}/lotes")
    public ResponseEntity<?> listarLotesDoInsumo(@PathVariable Long id) {
        // Ordenado por validade: o primeiro da lista é o próximo a vencer (FEFO)
        return ResponseEntity.ok(
            repL.findByInsumoIdInsumoAndQuantidadeAtualGreaterThanOrderByDataValidadeAsc(id, 0.0)
        );
    }

    @GetMapping("/insumos/vencendo")
    public ResponseEntity<?> listarLotesVencendo(@RequestParam(defaultValue = "7") int dias) {
        LocalDate hoje = LocalDate.now();
        LocalDate limite = hoje.plusDays(dias);

        return ResponseEntity.ok(
            repL.findByDataValidadeBetweenAndQuantidadeAtualGreaterThan(hoje, limite, 0.0)
        );
    }

    @PutMapping("/lotes/{id}/perda")
    public ResponseEntity<Map<String, String>> registrarPerdaLote(
            @PathVariable Long id, @RequestBody MovimentacaoDTO dto) {

        Optional<LoteInsumo> loteOpt = repL.findById(id);

        if (loteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        LoteInsumo lote = loteOpt.get();
        Double quantidadePerdida = dto.quantidade() != null
            ? dto.quantidade()
            : lote.getQuantidadeAtual();

        lote.setQuantidadeAtual(lote.getQuantidadeAtual() - quantidadePerdida);
        repL.save(lote);

        Insumo insumo = lote.getInsumo();
        insumo.setEstoqueAtual(insumo.getEstoqueAtual() - quantidadePerdida);
        repI.save(insumo);

        MovimentacaoEstoque mov = new MovimentacaoEstoque();
        mov.setInsumo(insumo);
        mov.setLote(lote);
        mov.setTipoMovimentacao(dto.tipoMovimentacao()); // "PERDA_VALIDADE" ou "PERDA_OUTRO"
        mov.setQuantidade(quantidadePerdida);
        mov.setMotivo(dto.motivo());
        mov.setDataMovimentacao(LocalDateTime.now());
        repM.save(mov);

        return ResponseEntity.ok(Map.of("message", "Perda registrada"));
    }

    // =====================================================
    // FICHA TÉCNICA (produto <-> insumo)
    // =====================================================

    @PostMapping("/produtos/{idProduto}/insumos")
    public ResponseEntity<ReceitaInsumo> vincularInsumoAoProduto(
            @PathVariable Long idProduto, @RequestBody @Valid ReceitaInsumoDTO dto) {

        Receitas produto = repR.findById(idProduto)
            .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        Insumo insumo = repI.findById(dto.idInsumo())
            .orElseThrow(() -> new RuntimeException("Insumo não encontrado"));

        ReceitaInsumo vinculo = new ReceitaInsumo();
        vinculo.setReceita(produto);
        vinculo.setInsumo(insumo);
        vinculo.setQuantidadePorUnidade(dto.quantidadePorUnidade());
        repRI.save(vinculo);

        return ResponseEntity.ok(vinculo);
    }

    @GetMapping("/produtos/{idProduto}/insumos")
    public ResponseEntity<?> listarFichaTecnica(@PathVariable Long idProduto) {
        return ResponseEntity.ok(repRI.findByReceitaIdReceitas(idProduto));
    }

    @DeleteMapping("/produtos/{idProduto}/insumos/{idReceitaInsumo}")
    public ResponseEntity<Map<String, String>> removerVinculoInsumo(
            @PathVariable Long idProduto, @PathVariable Long idReceitaInsumo) {

        if (!repRI.existsById(idReceitaInsumo)) {
            return ResponseEntity.notFound().build();
        }

        repRI.deleteById(idReceitaInsumo);

        return ResponseEntity.ok(Map.of("message", "Vínculo removido da ficha técnica"));
    }

    // =====================================================
    // MOVIMENTAÇÕES / RELATÓRIOS DE DESPERDÍCIO
    // =====================================================

    @GetMapping("/insumos/{id}/movimentacoes")
    public ResponseEntity<?> listarMovimentacoes(@PathVariable Long id) {
        return ResponseEntity.ok(repM.findByInsumoIdInsumoOrderByDataMovimentacaoDesc(id));
    }

    @GetMapping("/relatorios/perdas")
    public ResponseEntity<?> relatorioDePerdas(
            @RequestParam String inicio, @RequestParam String fim) {

        LocalDateTime dataInicio = LocalDate.parse(inicio).atStartOfDay();
        LocalDateTime dataFim = LocalDate.parse(fim).atTime(23, 59, 59);

        List<MovimentacaoEstoque> perdasValidade = repM
            .findByTipoMovimentacaoAndDataMovimentacaoBetween("PERDA_VALIDADE", dataInicio, dataFim);
        List<MovimentacaoEstoque> perdasOutro = repM
            .findByTipoMovimentacaoAndDataMovimentacaoBetween("PERDA_OUTRO", dataInicio, dataFim);

        return ResponseEntity.ok(Map.of(
            "perdasPorValidade", perdasValidade,
            "perdasPorOutroMotivo", perdasOutro
        ));
    }
}