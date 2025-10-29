async function carregar(url) {
    try {
        const response = await fetch(url);
        if (!response.ok)
            throw new Error("Erro ao buscar receitas");
        return await response.json();
    }
    catch (error) {
        console.error(error);
        return [];
    }
}
export async function carregarReceitasBlog() {
    return carregar("http://localhost:8080/receitas/todas");
}
export async function carregarReceitasProdutos() {
    return carregar("http://localhost:8080/receitas/produtos");
}
export async function carregarReceitaPorId(id){
    return carregar(`http://localhost:8080/receitas/buscar/${id}`)
}
export async function carregarProdutoPorId(id){
    return carregar(`http://localhost:8080/receitas/produtos/${id}`)
}

//# sourceMappingURL=receitas.js.map