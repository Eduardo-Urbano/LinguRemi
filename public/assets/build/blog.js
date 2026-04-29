import { carregarReceitas } from "./receitas.js"; // ajuste o caminho conforme a pasta final

const container = document.getElementById("blog");

async function renderizarReceitas() {
    console.log("blog.js carregado");

    try {
        const receitas = await carregarReceitas();
        console.log("Receitas recebidas:", receitas);

        container.innerHTML = ""; // limpa antes de adicionar

        receitas.forEach(receita => {
            const card = document.createElement("div");
            card.className = "bg-white rounded-xl shadow-lg overflow-hidden flex flex-col sm:flex-row";

            card.innerHTML = `
                <img src="${receita.imgReceitablog}" alt="${receita.nomeReceitablog}" class="w-full sm:w-60 h-48 object-cover">
                <div class="p-4 flex flex-col"> 
                    <h4 class="font-light text-gray-400">${new Date(receita.dataReceitablog).toLocaleDateString()}</h4>
                    <h3 class="font-bold text-lg mb-2">${receita.nomeReceitablog}</h3> 
                    <p class="text-gray-600 text-sm">${receita.descricaoReceitablog}</p>
                    <p class="text-gray-500 text-xs"><strong>Tempo:</strong> ${receita.tempoReceitablog}</p>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro ao carregar receitas:", erro);
        container.innerHTML = "<p class='text-red-500'>Não foi possível carregar as receitas.</p>";
    }
}

document.addEventListener("DOMContentLoaded", renderizarReceitas);
