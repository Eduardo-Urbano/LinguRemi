import { carregarReceitas } from "./receitas.js";
const adicionarButton = document.getElementById('adicionarBtn');
const adicionarReceita = document.getElementById('adicionarReceita');
const closeAdicionar = document.getElementById('closeAdicionar');
const modalReceita = document.getElementById('newReceitaModal');
const fotoInput = document.getElementById("fotoDoce");
const fileName = document.getElementById("fileName");
adicionarButton.addEventListener('click', (e) => {
    (e).preventDefault();
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
    const preparo = document.getElementById('preparo').value;
    const file = fotoInput.files?.[0];
    if (!file) {
        alert("Selecione uma imagem!");
        return;
    }
    const formData = new FormData();
    formData.append("nome", nomeReceita);
    formData.append("ingredientes", ingredientes);
    formData.append("preparo", preparo);
    formData.append("foto", file);
    await enviarReceita(formData);
});
async function enviarReceita(formData) {
    try {
        const response = await fetch("http://localhost:8080/receitas", {
            method: "POST",
            body: formData
        });
        if (response.ok) {
            alert("Receita cadastrada com sucesso!");
            carregarReceitas(); // Chama a função para atualizar os cards
        }
        else {
            alert("Erro ao cadastrar a receita");
        }
    }
    catch (error) {
        console.log(error);
        alert("Erro ao se conectar à API");
    }
}
//# sourceMappingURL=newReceita.js.map