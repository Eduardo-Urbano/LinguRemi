document.addEventListener('DOMContentLoaded', () => {
    const cadastrarSubmit = document.getElementById('cadastrarSubmit') as HTMLElement;
    const modalCadastro = document.getElementById('cadastroModal')!;

    cadastrarSubmit.addEventListener('click', () => {    
        const senha = (document.getElementById('senha') as HTMLInputElement).value;
        const senhaD = (document.getElementById('senhaD') as HTMLInputElement).value;
        const email = (document.getElementById('emailCadastro') as HTMLInputElement).value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(senha !== senhaD){
            alert('As senhas não coincidem!')
            return;
        }else if(!emailRegex.test(email)){
                alert ('Insira um email válido!')
                return;
            }else{
                class NovoUsuario {
                    private role: string;
                    private nome: string;
                    private email: string;
                    private senha: string;
                    
                    constructor(role: string, nome: string, email: string, senha: string) {
                        this.role = role;
                        this.nome = nome;
                        this.email = email;
                        this.senha = senha;
                    }
                }
                const usuario = new NovoUsuario(
                    "USER",
                    (document.getElementById('nome') as HTMLInputElement).value,
                    (document.getElementById('emailCadastro') as HTMLInputElement).value,
                    (document.getElementById('senha') as HTMLInputElement).value
                );
                //console.log(usuario);
                fetch("http://localhost:8080/usuarios/cadastrar",{
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(usuario)
                })
                .then(response => {
                    if(!response.ok) throw new Error("Erro ao cadastrar usuário!");
                    return response.json();
                })
                .then(data => {
                    alert("Cadastro realizado com sucesso!");
                    modalCadastro.classList.remove('flex');
                    modalCadastro.classList.add('hidden');
                })
                .catch(error =>{
                    console.error("Erro:", error);
                    alert("Erro ao cadastrar usuário!");
                }); 
        }       
    });
});