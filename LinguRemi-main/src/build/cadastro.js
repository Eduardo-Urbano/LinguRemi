document.addEventListener('DOMContentLoaded', () => {
    const cadastrarSubmit = document.getElementById('cadastrarSubmit');
    const modalCadastro = document.getElementById('cadastroModal');
    cadastrarSubmit.addEventListener('click', () => {
        const senha = document.getElementById('senha').value;
        const senhaD = document.getElementById('senhaD').value;
        const email = document.getElementById('emailCadastro').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (senha !== senhaD) {
            alert('As senhas não coincidem!');
            return;
        }
        else if (!emailRegex.test(email)) {
            alert('Insira um email válido!');
            return;
        }
        else {
            class NovoUsuario {
                role;
                nome;
                email;
                senha;
                constructor(role, nome, email, senha) {
                    this.role = role;
                    this.nome = nome;
                    this.email = email;
                    this.senha = senha;
                }
            }
            const usuario = new NovoUsuario("USER", document.getElementById('nome').value, document.getElementById('emailCadastro').value, document.getElementById('senha').value);
            //console.log(usuario);
            fetch("http://localhost:8080/usuarios/cadastrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario)
            })
                .then(response => {
                if (!response.ok)
                    throw new Error("Erro ao cadastrar usuário!");
                return response.json();
            })
                .then(data => {
                alert("Cadastro realizado com sucesso!");
                modalCadastro.classList.remove('flex');
                modalCadastro.classList.add('hidden');
            })
                .catch(error => {
                console.error("Erro:", error);
                alert("Erro ao cadastrar usuário!");
            });
        }
    });
});
export {};
//# sourceMappingURL=cadastro.js.map