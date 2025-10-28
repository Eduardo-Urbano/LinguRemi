import { receitasDoce } from "./receitas";

document.addEventListener("DOMContentLoaded", function () {
    const cont1 = document.getElementById("produto") as HTMLElement;
    if (!cont1) return;

    function dadosProduto(receita) {
        cont1.innerHTML = "";

        const card = document.createElement("div");
        card.className = "mx-auto flex flex-row gap-6 p-4";

        card.innerHTML = `
            <div class="flex">
                <img src="${receita.imagem}" alt="${receita.nome}" class="w-180 h-120 rounded-xl object-cover">
            </div>
            <div class="rounded-xl bg-white shadow-lg p-5 w-150">
                <h1 class="font-bold text-sm pb-5">${receita.nome}</h1>
                <h2 class="font-normal text-lg">R$ ${receita.preco}</h2>
            </div>
        `;
        cont1.appendChild(card);
    }

    dadosProduto(receitasDoce[0]);
});
