import { isUserLogged, logout } from "./auth.js";
document.addEventListener("DOMContentLoaded", async () => {
    // Verifica se está logado
    if (!isUserLogged()) {
        window.location.href = "../index.html";
        return;
    }
    // Exibe nome e e-mail do usuário
    const nome = localStorage.getItem("nomeUser") || "Usuário";
    const email = localStorage.getItem("emailUser") || "E-mail não encontrado";
    const nameElement = document.getElementById("userName");
    const emailElement = document.getElementById("userEmail");
    nameElement.textContent = `Nome: ${nome}`;
    emailElement.textContent = `Email: ${email}`;
    // Logout
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => logout());
    }
    // Carrega histórico
    try {
        const response = await fetch("https://linguremi-api.onrender.com/historico/dados");
        if (!response.ok)
            throw new Error("Erro ao buscar histórico");
        const historicos = await response.json();
        const userHistoricos = historicos.filter((h) => h.emailTransferencia === email);
        const container = document.getElementById("itensHist");
        container.innerHTML = ""; // limpa o conteúdo inicial
        if (userHistoricos.length === 0) {
            container.innerHTML = `
        <p class="text-center text-gray-300 p-4">Nenhum histórico encontrado.</p>
      `;
            return;
        }
        // Cria cards
        userHistoricos.forEach((h) => {
            const card = document.createElement("div");
            card.className =
                "bg-white/70 text-black rounded-xl shadow-md p-4 mb-4 hover:shadow-lg transition";
            card.innerHTML = `
        <p class="text-sm text-gray-700"><strong>Tipo:</strong> Compra</p>
        <p class="text-lg font-semibold">${h.descTransferencia}</p>
        <p class="text-gray-700 mt-1"><strong>Valor:</strong> R$ ${h.valorTransferencia.toFixed(2)}</p>
        <p class="text-gray-600 text-sm mt-1">Data: ${new Date(h.dataTransferencia).toLocaleString()}</p>

        <div class="mt-3 border-t border-gray-300 pt-2">
          <p class="font-medium mb-1">Itens:</p>
          ${h.itens
                .map((item) => `
              <div class="pl-2 mb-1">
                <span class="text-sm">🍰 ${item.receita.nomeReceitas}</span>
                <span class="text-sm text-gray-600">x${item.quantidade}</span>
              </div>
            `)
                .join("")}
        </div>
      `;
            container.appendChild(card);
        });
    }
    catch (error) {
        console.error(error);
        alert("Erro ao carregar histórico!");
    }
});
//# sourceMappingURL=perfil.js.map