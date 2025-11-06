import { carregarReceitasBlog } from "./receitas.js";
import { isUserLogged } from "./auth.js";
const adicionarButton = document.getElementById('adicionarBtn');
const adicionarReceita = document.getElementById('adicionarReceita');
const closeAdicionar = document.getElementById('closeAdicionar');
const modalReceita = document.getElementById('newReceitaModal');
const fotoInput = document.getElementById("fotoDoce");
const fileName = document.getElementById("fileName");
//Verifica se todos os elementos existem
if (adicionarButton &&
    adicionarReceita &&
    closeAdicionar &&
    modalReceita &&
    fotoInput &&
    fileName) {
    // Abrir modal
    adicionarButton.addEventListener('click', (e) => {
        if (!isUserLogged()) {
            e.preventDefault();
            alert("É necessário estar logado primeiro!");
            return;
        }
        else {
            modalReceita.classList.remove('hidden');
            modalReceita.classList.add('flex');
            return;
        }
    });
    // Fechar modal
    closeAdicionar.addEventListener('click', () => {
        modalReceita.classList.remove('flex');
        modalReceita.classList.add('hidden');
    });
    // Mostrar nome da imagem selecionada
    fotoInput.addEventListener("change", () => {
        const file = fotoInput.files?.[0];
        fileName.textContent = file ? file.name : "Nenhuma imagem selecionada";
    });
    // Enviar dados
    adicionarReceita.addEventListener('click', async (e) => {
        e.preventDefault();
        const nomeReceita = document.getElementById('nomeReceita')?.value.trim() || "";
        const ingReceita = document.getElementById('ingReceita')?.value.trim() || "";
        const preparoReceita = document.getElementById('preparoReceita')?.value.trim() || "";
        const descReceita = document.getElementById('descReceita')?.value.trim() || "";
        const tempoReceita = document.getElementById('tempoReceita')?.value.trim() || "";
        const file = fotoInput.files?.[0];
        if (!file) {
            alert("Selecione uma imagem!");
            return;
        }
        const formData = new FormData();
        formData.append("nomeReceita", nomeReceita);
        formData.append("ingReceita", ingReceita);
        formData.append("preparoReceita", preparoReceita);
        formData.append("descReceita", descReceita);
        formData.append("tempoReceita", tempoReceita);
        formData.append("imgReceita", file);
        await enviarReceita(formData);
    });
}
else {
    console.error("❌ Um ou mais elementos do DOM não foram encontrados.");
}
async function enviarReceita(formData) {
    try {
        const response = await fetch("http://localhost:8080/receitas/cadastrar", {
            method: "POST",
            body: formData,
        });
        if (response.ok) {
            alert("Receita cadastrada com sucesso!");
            await carregarReceitasBlog();
        }
        else {
            alert("Erro ao cadastrar a receita");
        }
    }
    catch (error) {
        console.error(error);
        alert("Erro ao se conectar à API");
    }
}
//# sourceMappingURL=newReceita.js.map