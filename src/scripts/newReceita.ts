import { carregarReceitasBlog } from "./receitas.js";

const adicionarButton = document.getElementById('adicionarBtn') as HTMLButtonElement | null;
const adicionarReceita = document.getElementById('adicionarReceita') as HTMLButtonElement | null;
const closeAdicionar = document.getElementById('closeAdicionar') as HTMLButtonElement | null;
const modalReceita = document.getElementById('newReceitaModal') as HTMLElement | null;
const fotoInput = document.getElementById("fotoDoce") as HTMLInputElement | null;
const fileName = document.getElementById("fileName") as HTMLElement | null;

// 🔒 Verifica se todos os elementos existem
if (
  adicionarButton &&
  adicionarReceita &&
  closeAdicionar &&
  modalReceita &&
  fotoInput &&
  fileName
) {
  // Abrir modal
  adicionarButton.addEventListener('click', (e: MouseEvent) => {
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
  adicionarReceita.addEventListener('click', async (e: MouseEvent) => {
    e.preventDefault();

    const nomeReceita = (document.getElementById('nomeReceita') as HTMLInputElement | null)?.value.trim() || "";
    const ingReceita = (document.getElementById('ingReceita') as HTMLTextAreaElement | null)?.value.trim() || "";
    const preparoReceita = (document.getElementById('preparoReceita') as HTMLTextAreaElement | null)?.value.trim() || "";
    const descReceita = (document.getElementById('descReceita') as HTMLTextAreaElement | null)?.value.trim() || "";
    const tempoReceita = (document.getElementById('tempoReceita') as HTMLInputElement | null)?.value.trim() || "";
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
} else {
  console.error("❌ Um ou mais elementos do DOM não foram encontrados.");
}

async function enviarReceita(formData: FormData): Promise<void> {
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
