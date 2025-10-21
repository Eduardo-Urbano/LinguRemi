const loginBtn = document.querySelector('a[href="#"]') as HTMLElement;
const modal = document.getElementById('loginModal')!;
const closeModal = document.getElementById('closeModal')!;
const loginSubmit = document.getElementById('loginSubmit')!;
const cadastroSubmit = document.getElementById('cadastroSubmit')!;
const modalCadastro = document.getElementById('cadastroModal')!;
const closeCadastro = document.getElementById('closeCadastro')!;

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.remove('hidden');
    modal.classList.add('flex')
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('flex')
    modal.classList.add('hidden');
});

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
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const senha = (document.getElementById('password') as HTMLInputElement).value;

    try {
        const response = await fetch('http://localhost:8080/usuarios', { // URL da sua API
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha})
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert('Erro: ' + (errorData.message || 'Credenciais inválidas'));
            return;
        }
        // JWT aqui
        const token = await response.text(); 
        localStorage.setItem('jwtToken', token);

        alert('Login realizado com sucesso!');
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        
        window.location.href = "/index.html";

    } catch (error) {
        console.error(error);
        alert('Erro ao conectar com a API');
    }
});

async function buscarDadosProtegidos() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        alert("Faça login primeiro!");
        return;
    }

    try {
        const response = await fetch('', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            alert('Token inválido ou expirado!');
            return;
        }

        const data = await response.json();
        console.log('Dados:', data);

    } catch (error) {
        console.error(error);
        alert('Erro ao buscar dados');
    }
}