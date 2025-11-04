import { carregarReceitasBlog } from "./receitas.js";

const adicionarButton = document.getElementById('adicionarBtn') as HTMLElement;
const adicionarReceita = document.getElementById('adicionarReceita') as HTMLElement;
const closeAdicionar = document.getElementById('closeAdicionar') as HTMLElement;
const modalReceita = document.getElementById('newReceitaModal')!;
const fotoInput = document.getElementById("fotoDoce") as HTMLInputElement;
const fileName = document.getElementById("fileName") as HTMLElement;

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
  const nomeReceitaBlog = (document.getElementById('nomeReceita') as HTMLInputElement).value;
  const descricaoReceitaBlog = (document.getElementById('descricao') as HTMLInputElement).value;
  const ingredientesReceitaBlog = (document.getElementById('ingredientes') as HTMLInputElement).value;
  const preparoReceitaBlog = (document.getElementById('preparo') as HTMLInputElement).value;
  const file = fotoInput.files?.[0];

  if (!file) {
    alert("Selecione uma imagem!");
    return;
  }

  const formData = new FormData();
  formData.append("nomeReceitaBlog", nomeReceitaBlog);
  formData.append("descricaoReceitaBlog", descricaoReceitaBlog);
  formData.append("ingredientesReceitaBlog", ingredientesReceitaBlog);
  formData.append("preparoReceitaBlog",preparoReceitaBlog);
  formData.append("imgReceitaBlog", file);

  await enviarReceita(formData);
});

async function enviarReceita(formData: FormData) {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = user?.token;

    const response = await fetch("http://localhost:8080/receitaBlog/cadastrar", {
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
    } else {
      alert("Erro ao cadastrar a receita");
    }
  } catch (error) {
    console.error(error);
    alert("Erro ao se conectar à API");
  }
}