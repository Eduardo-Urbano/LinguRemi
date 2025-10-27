import { receitasDoce } from "./receitas.js";
document.addEventListener("DOMContentLoaded", () => {
    const container1 = document.getElementById("blog");
    if (!container1)
        return;
    function criarCards() {
        container1.innerHTML = "";
        receitasDoce.forEach((receita) => {
            const card = document.createElement("div");
            card.className =
                "bg-white rounded-xl shadow-lg overflow-hidden flex flex-row";
            card.innerHTML = `
        <img src="${receita.imagem}" alt="${receita.nome}" class="w-60 h-48 object-cover">
        <div class="p-4 flex flex-col"> 
            <h4 class="font-light text-gray-400">${receita.data}</h4>
            <h3 class="font-bold text-lg mb-2">${receita.nome}</h3> 
            <p class="text-gray-600 text-sm">${receita.descricao}</p>
        </div>
        `;
            console.log("criando cards");
            container1.appendChild(card);
        });
    }
    criarCards();
});
//# sourceMappingURL=blog.js.map