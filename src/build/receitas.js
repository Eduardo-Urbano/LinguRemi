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
    return carregar("http://localhost:8080/receitas");
}
export async function carregarReceitasProdutos() {
    return carregar("http://localhost:8080/receitas/produtos");
}
//# sourceMappingURL=receitas.js.map