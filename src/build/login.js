const loginBtn = document.querySelector('a[href="#"]');
const modal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');
const loginSubmit = document.getElementById('loginSubmit');
const cadastroSubmit = document.getElementById('cadastroSubmit');
const modalCadastro = document.getElementById('cadastroModal');
const closeCadastro = document.getElementById('closeCadastro');
//Botão de Login
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
});
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
});
// Função de login
loginSubmit.addEventListener('click', async () => {
    const login = document.getElementById('email').value;
    const password = document.getElementById('password').value;
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
        if (!token) {
            alert('Token não recebido!');
            return;
        }
        //Armazena token no localStorage
        localStorage.setItem('jwtToken', token);
        alert('Login realizado com sucesso!');
        //Fecha modal e redireciona
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        window.location.href = "../public/index.html";
    }
    catch (error) {
        console.log(error);
        alert('Erro ao conectar com a API!');
    }
});
export {};
//# sourceMappingURL=login.js.map