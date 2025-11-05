import { isUserLogged, logout, updateAuthLinks } from "./auth.js";
const loginBtn = document.querySelector('a[href="#"]');
const modal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');
const loginSubmit = document.getElementById('loginSubmit');
const cadastroSubmit = document.getElementById('cadastroSubmit');
const modalCadastro = document.getElementById('cadastroModal');
const closeCadastro = document.getElementById('closeCadastro');
//Botão para abrir o modal de Login
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
});
//Botão de fechar o modal de login
closeModal.addEventListener('click', () => {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
});
//Botão de Cadastro
cadastroSubmit.addEventListener('click', () => {
    // Fecha modal de login
    modal.classList.remove('flex');
    modal.classList.add('hidden');
    // Abre modal de cadastro
    modalCadastro.classList.remove('hidden');
    modalCadastro.classList.add('flex');
});
// Fecha modal de cadastro
closeCadastro.addEventListener('click', () => {
    modalCadastro.classList.remove('flex');
    modalCadastro.classList.add('hidden');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
});
// Função de login
loginSubmit.addEventListener('click', async () => {
    const login = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!login || !password) {
        alert('Preencha os campos!');
        return;
    }
    else {
        //Conexão com a API
        try {
            const response = await fetch('http://localhost:8080/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login: login, password })
            });
            //Se der erro
            if (!response.ok) {
                let errorMsg = `Erro ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData.message)
                        errorMsg = errorData.message;
                }
                catch { }
                alert('Erro ao fazer login: ' + errorMsg);
                return;
            }
            //Login OK
            const data = await response.json();
            const token = data.token;
            const nome = data.nome;
            const email = data.email;
            if (!token) {
                alert('Token não recebido!');
                return;
            }
            //Armazena token no localStorage
            localStorage.setItem('jwtToken', token);
            localStorage.setItem('nomeUser', nome);
            localStorage.setItem('emailUser', email);
            alert('Login realizado com sucesso!');
            console.log(token);
            console.log('Login realizado');
            isUserLogged();
            updateAuthLinks();
            /*Troca o link do login pelo de perfil do usuário
            logad0.classList.remove('flex');
            logad0.classList.add('hidden');
            logad1.textContent = nome;
            logad1.classList.remove('hidden');
            logad1.classList.add('flex');
            */
            //Fecha modal
            modal.classList.remove('flex');
            modal.classList.add('hidden');
            //Erro de conexão com a API
        }
        catch (error) {
            console.log(error);
            alert('Erro ao conectar com a API!');
        }
    }
});
//# sourceMappingURL=login.js.map