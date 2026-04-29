import { carregarReceitasProdutos } from "./receitas.js";
import { renderizarReceitas } from "./renderizarReceitas.js";
document.addEventListener("DOMContentLoaded", async () => {
    const receitas = await carregarReceitasProdutos();
    renderizarReceitas(receitas, "produtos");
});
//# sourceMappingURL=initProdutos.js.map