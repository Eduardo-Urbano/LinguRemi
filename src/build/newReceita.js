import { carregarReceitasBlog } from "./receitas.js";

const adicionarButton = document.getElementById('adicionarBtn');
const adicionarReceita = document.getElementById('adicionarReceita');
const closeAdicionar = document.getElementById('closeAdicionar');
const modalReceita = document.getElementById('newReceitaModal');
const fotoInput = document.getElementById("fotoDoce");
const fileName = document.getElementById("fileName");

// Abrir modal
adicionarButton.addEventListener('click', (e) => {
    e.preventDefault();
    modalReceita.classList.remove('hidden');
    modalReceita.classList.add('flex');
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

    const nomeReceita = document.getElementById('nomeReceita').value.trim();
    const ingReceita = document.getElementById('ingReceita').value.trim();
    const preparoReceita = document.getElementById('preparoReceita').value.trim();
    const descReceita = document.getElementById('descReceita').value.trim();
    const tempoReceita = document.getElementById('tempoReceita').value.trim();
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

async function enviarReceita(formData) {
    try {
        const response = await fetch("http://localhost:8080/receitas/cadastrar", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert("Receita cadastrada com sucesso!");
            await carregarReceitasBlog();
        } else {
            alert("Erro ao cadastrar a receita");
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao se conectar à API");
    }
}
