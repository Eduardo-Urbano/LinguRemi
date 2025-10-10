import { receitasDoce } from "./receitas.js";

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("cards") as HTMLElement;
    if (!container) return;

    let index = 0;

    function criarCards() {
    container.innerHTML = "";

    for (let i = 0; i < receitasDoce.length; i++) {
        const receita = receitasDoce[i]!;

        const card = document.createElement("div");
        card.className = "bg-white rounded-xl shadow-lg overflow-hidden flex flex-col";

        card.innerHTML = `
        <img src="${receita.imagem}" alt="${receita.nome}" class="w-full h-48 object-cover">
        
        <div class="p-4 flex flex-col"> 
            <h3 class="font-bold text-lg mb-2">${receita.nome}</h3> 
            <p class="text-gray-600 text-sm">${receita.descricao}</p>
        </div>
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