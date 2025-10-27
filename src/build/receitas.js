export async function carregarReceitas() {
    try {
        const response = await fetch("http://localhost:8080/receitas");
        if (!response.ok) {
            throw new Error("Erro ao Buscar receitas");
        }
        const receitas = await response.json();
        return receitas;
    }
    catch (error) {
        console.log(error);
        return [];
    }
}
//# sourceMappingURL=receitas.js.map