import { receitasDoce } from "./receitas.js";
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("cards");
    if (!container)
        return;
    let index = 0;
    function criarCards() {
        container.innerHTML = "";
        for (let i = 0; i < receitasDoce.length; i++) {
            const receita = receitasDoce[i];
            const card = document.createElement("div");
            card.className = "bg-white p-4 rounded shadow flex flex-col h-80";
            // h-80 = altura fixa, flex-col para alinhar verticalmente
            card.innerHTML = `
            <img src="${receita.imagem}" alt="${receita.nome}" class="w-full h-32 object-cover rounded mb-2">
            <h3 class="font-bold text-lg">${receita.nome}</h3>
            <p class="text-gray-600 text-sm">${receita.descricao}</p>
        `;
            container.appendChild(card);
        }
    }
    document.getElementById("next")?.addEventListener("click", () => {
        index = (index + 1) % receitasDoce.length;
        criarCards();
    });
    document.getElementById("prev")?.addEventListener("click", () => {
        index = (index - 1 + receitasDoce.length) % receitasDoce.length;
        criarCards();
    });
    criarCards();
});
//# sourceMappingURL=doces.js.map