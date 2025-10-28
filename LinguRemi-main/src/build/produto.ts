import { receitasDoce} from "./receitas.js";

document.addEventListener("DOMContentLoaded", () => {
    const cont1 = document.getElementById("produto") as HTMLElement;
    if (!cont1) return;

    function dadosProduto(receita) {
        cont1.innerHTML = "";

        // Campo de quantidade
        let campoQuantidade = "";
        if (receita.tipoQuantidade === "unidade") {
            campoQuantidade = `
                <label class="font-medium mb-1">Quantidade: </label>
                <input type="number" min="5" value="5" class="border rounded p-1 w-20 text-center" />
                <span class="ml-1 text-sm text-gray-600">unidades</span>
            `;
        } else if (receita.tipoQuantidade === "peso") {
            campoQuantidade = `
                <label class="font-medium mb-1">Peso: </label>
                <input type="number" step="0.100" min="0.100" value="1.00" class="border rounded p-1 w-20 text-center" />
                <span class="text-sm text-gray-600">kg</span>
            `;
        }

        // Disponibilidade
        let campoDisponivel = "";
        if (receita.disponivel > 40) {
            campoDisponivel = `<h3 class="font-medium text-base mb-5 pl-3 ">Em estoque!</h3>`;
        } else if (receita.disponivel > 0) {
            campoDisponivel = `<h3 class="font-medium text-base mb-5 pl-3">Apenas ${receita.disponivel} unidades restantes!</h3>`;
        }

        const card = document.createElement("div");
        card.className = "mx-auto rounded-xl shadow-lg bg-gray-100 gap-6 w-max";
        card.innerHTML = `
            <div class="flex flex-row p-5 gap-6">
                <div class="flex">
                    <img src="${receita.imagem}" alt="${receita.nome}" class="w-180 h-120 rounded-xl object-cover">
                </div>
                <div class="rounded-xl bg-white shadow-lg p-5 w-90 items-center">
                    <h1 class="font-semibold text-2xl pl-3">${receita.nome}</h1>
                    <span class="text-sm pl-3">★${receita.avaliacao} de ${getRandomInt(5,300)} avaliações</span>
                    <h2 class="font-medium text-xl mt-5 mb-5 pl-3">R$ ${receita.preco}</h2>
                    <div class="mb-5 pl-3">${campoQuantidade}</div>
                    <div>${campoDisponivel}</div>
                    <div class="text-center items-center">
                        <button type="button" class="rounded-xl shadow-lg hover:bg-gray-200 w-70 p-0.5 pl-1 pr-1 mb-5 transition btn-add-cart">
                            Adicionar ao Carrinho
                        </button>
                        <button type="button" class="rounded-xl shadow-lg hover:bg-gray-200 w-70 p-0.5 pl-1 pr-1 mb-2 transition">
                            Comprar Agora
                        </button>
                    </div>
                </div>
            </div>
            <div class="mt-6 border-t pt-4">
                <h2 class="text-xl font-semibold pl-5 mb-2">Descrição</h2>
                <p class="text-lg leading-relaxed pl-5">${receita.descricao || "Sem descrição disponível."}</p>
            </div>
        `;
        cont1.appendChild(card);

        const btnAddCart = card.querySelector(".btn-add-cart") as HTMLButtonElement;
        const inputQuantidade = card.querySelector("input") as HTMLInputElement;

        btnAddCart?.addEventListener("click", () => {
            let cart: any[] = JSON.parse(localStorage.getItem("cart") || "[]");
            const quantidade = Number(inputQuantidade?.value) || 1;

            cart.push({
                nome: receita.nome,
                preco: receita.preco,
                imagem: receita.imagem,
                quantidade: quantidade,
                tipoQuantidade: receita.tipoQuantidade
            });

            localStorage.setItem("cart", JSON.stringify(cart));
            alert(`${receita.nome} adicionado ao carrinho!`);
        });
    }

    dadosProduto(receitasDoce[0]);
});

// Função utilitária
function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
