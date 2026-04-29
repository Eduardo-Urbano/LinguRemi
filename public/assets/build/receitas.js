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
    return carregar("https://linguremi-api.onrender.com/receitas/todas");
}
export async function carregarReceitasProdutos() {
    return carregar("https://linguremi-api.onrender.com/receitas/produtos");
}
//# sourceMappingURL=receitas.js.map