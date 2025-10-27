import { receitasDoce } from "./receitas.js";
document.addEventListener("DOMContentLoaded", () => {
    const container1 = document.getElementById("cards1");
    const container2 = document.getElementById("cards2");
    if (!container1 || !container2)
        return;
    function criarCards() {
        container1.innerHTML = "";
        container2.innerHTML = "";
        receitasDoce.forEach((receita) => {
            const card = document.createElement("div");
            card.className =
                "bg-white rounded-xl shadow-lg overflow-hidden flex flex-col";
            card.innerHTML = `
        <img src="${receita.imagem}" alt="${receita.nome}" class="w-full h-48 object-cover">
        <div class="p-4 flex flex-col"> 
            <h3 class="font-bold text-lg mb-2">${receita.nome}</h3> 
            <p class="text-gray-600 text-sm">${receita.descricao}</p>
        </div>
        `;
            console.log("criando cards");
            container1.appendChild(card);
            container2.appendChild(card.cloneNode(true));
        });
    }
    criarCards();
});
export function atualizarCards() {
    console.log("Atualizando cards de receitas...");
    //Lógica para adicionar cards novos
}
//# sourceMappingURL=cardsReceitas.js.map