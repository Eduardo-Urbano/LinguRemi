import type { Receita } from "./criarReceitas.js";
import { carregarReceitas } from "./receitas.js";

const container = document.getElementById("blog") as HTMLElement;

async function renderizarReceitas() {
  const receitas = await carregarReceitas();

  container.innerHTML = ""; // limpa os cards

  receitas.forEach((receita: Receita) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow-lg overflow-hidden flex flex-row";
    card.innerHTML = `
      <img src="${receita.fotoUrl}" alt="${receita.nome}" class="w-60 h-48 object-cover">
      <div class="p-4 flex flex-col"> 
        <h4 class="font-light text-gray-400">${receita.data}</h4>
        <h3 class="font-bold text-lg mb-2">${receita.nome}</h3> 
        <p class="text-gray-600 text-sm">${receita.descricao}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", renderizarReceitas);