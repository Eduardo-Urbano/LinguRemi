const loginBtn = document.querySelector('a[href="#"]') as HTMLElement;
const modal = document.getElementById('loginModal')!;
const closeModal = document.getElementById('closeModal')!;
const loginSubmit = document.getElementById('loginSubmit')!;
const cadastroSubmit = document.getElementById('cadastroSubmit')!;
const modalCadastro = document.getElementById('cadastroModal')!;
const closeCadastro = document.getElementById('closeCadastro')!;
const logad0 = document.getElementById('ident0')!;
const logad1 = document.getElementById('ident1')!;

//Botão para abrir o modal de Login
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.remove('hidden');
    modal.classList.add('flex')
});

//Botão de fechar o modal de login
closeModal.addEventListener('click', () => {
    modal.classList.remove('flex')
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
    const login = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    //Conexão com a API
    try{
        const response = await fetch('http://localhost:8080/usuarios/login',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({login: login, password})
        });
        
        //Se der erro
        if(!response.ok){
            let errorMsg = `Erro ${response.status}`;
            try{
                const errorData =await response.json();
                if (errorData.message) errorMsg = errorData.message;
            }catch{}
            alert('Erro ao fazer login: '+ errorMsg);
            return;
        }

        //Login OK
        const data = await response.json();
        const token = data.token;
        const nomeUsuario = data.nomeUsuario;
        if(!token){
            alert('Token não recebido!');
            return;
        }

        //Armazena token no localStorage
        localStorage.setItem('jwtToken', token);
        alert('Login realizado com sucesso!');
        console.log(token);
        console.log('Login realizado');

        //Troca o link do login pelo de perfil do usuário
        logad0.classList.remove('flex')
        logad0.classList.add('hidden')
        logad1.textContent = nomeUsuario;
        logad1.classList.remove('hidden')
        logad1.classList.add('flex')

        //Fecha modal e redireciona
        modal.classList.remove('flex');
        modal.classList.add('hidden');

        window.location.href = "index.html";

    //Erro de conexão com a API
    }catch(error){
        console.log(error);
        alert('Erro ao conectar com a API!');
    }
});