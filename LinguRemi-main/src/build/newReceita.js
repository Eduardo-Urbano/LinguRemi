import { carregarReceitasBlog } from "./receitas.js";
const adicionarButton = document.getElementById('adicionarBtn');
const adicionarReceita = document.getElementById('adicionarReceita');
const closeAdicionar = document.getElementById('closeAdicionar');
const modalReceita = document.getElementById('newReceitaModal');
const fotoInput = document.getElementById("fotoDoce");
const fileName = document.getElementById("fileName");
adicionarButton.addEventListener('click', (e) => {
    e.preventDefault();
    modalReceita.classList.remove('hidden');
    modalReceita.classList.add('flex');
});
closeAdicionar.addEventListener('click', () => {
    modalReceita.classList.remove('flex');
    modalReceita.classList.add('hidden');
});
fotoInput.addEventListener("change", () => {
    const file = fotoInput.files?.[0];
    fileName.textContent = file ? file.name : "Nenhuma imagem selecionada";
});
adicionarReceita.addEventListener('click', async () => {
    const nomeReceita = document.getElementById('nomeReceita').value;
    const ingredientes = document.getElementById('ingredientes').value;
    const modoDePreparo = document.getElementById('preparo').value;
    const valorReceitas = parseFloat(document.getElementById('valor').value);
    const file = fotoInput.files?.[0];
    if (!file) {
        alert("Selecione uma imagem!");
        return;
    }
    const formData = new FormData();
    formData.append("nomeReceitas", nomeReceita);
    formData.append("ingredientes", ingredientes);
    formData.append("modoDePreparo", modoDePreparo);
    formData.append("valorReceitas", valorReceitas.toString());
    formData.append("foto", file);
    await enviarReceita(formData);
});
async function enviarReceita(formData) {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const token = user?.token;
        const response = await fetch("http://localhost:8080/receitas/cadastrar", {
            method: "POST",
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
            body: formData,
        });
        if (response.status === 401) {
            alert("Você precisa estar logado para cadastrar uma receita!");
            return;
        }
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