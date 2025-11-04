import { receitasDoce } from "./receitas.js";

document.addEventListener("DOMContentLoaded", function () {
    var cont1 = document.getElementById("receitaBlog");
    if (!cont1) return;

    function preencherReceita() {
        cont1.innerHTML = "";

        receitasDoce.forEach((receita) => {            
            var listaIng = receita.ingredientes.split(",");
            var listaHTML = listaIng.map(item => `<li>${item.trim()}</li>`).join("");

            var card = document.createElement("div");
            card.className =
                "mx-auto flex flex-col";
            card.innerHTML = `
            <h1 class="font-bold text-2xl mb-2 self-center pb-5">${receita.nome}</h1> 
            <img src="${receita.imagem}" alt="${receita.nome}" class="w-250 h-150 rounded-xl object-cover">
            <div class="p-4 flex flex-col max-w-250"> 
                <h2 class="font-bold text-center pb-5 text-lg">Tempo de preparo: ${receita.tempo}</h2>
                <h1 class="font-bold text-xl pb-5">Ingredientes:</h1>
                <ol class="grid grid-cols-2 list-disc ml-8 text-lg gap-2 pb-8 max-w-150">${listaHTML}</ol>
                <h1 class="font-bold text-xl pb-5">Modo de Preparo:</h1>
                <p class="text-xl">${receita.preparo}</p>
            </div>
        `;
        cont1.appendChild(card);
        });
    }
    preencherReceita();
});