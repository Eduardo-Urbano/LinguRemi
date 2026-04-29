import { carregarReceitasBlog } from "./receitas.js";
import { renderizarReceitas } from "./renderizarReceitas.js";
document.addEventListener("DOMContentLoaded", async () => {
    const receitas = await carregarReceitasBlog();
    renderizarReceitas(receitas, "blog");
});
//# sourceMappingURL=initBlog.js.map