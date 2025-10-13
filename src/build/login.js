//Seletores
const loginBtn = document.querySelector('a[href="#"]');
const modal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');
const loginSubmit = document.getElementById('loginSubmit');
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
});
closeModal.addEventListener('click', () => {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
});
// Função de login
loginSubmit.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        const response = await fetch('URL_DA_SUA_API/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Login realizado com sucesso!');
            modal.classList.remove('flex');
            modal.classList.add('hidden');
            // Redirecionar ou armazenar token
        }
        else {
            alert('Erro: ' + data.message);
        }
    }
    catch (error) {
        console.error(error);
        alert('Erro ao conectar com a API');
    }
});
export {};
//# sourceMappingURL=login.js.map