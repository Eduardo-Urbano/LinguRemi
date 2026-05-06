#  LinguRemi

Aplicação full stack desenvolvida como projeto acadêmico com foco em simular uma plataforma de confeitaria digital, incluindo catálogo de produtos, blog de receitas e sistema de autenticação.

---

##  Tecnologias

### Front-end
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Back-end
- Java
- Spring Boot
- JWT Authentication
- H2 / MySQL

---

## Funcionalidades

### Autenticação
- Login e cadastro com JWT
- Persistência de sessão
- Logout

### Produtos
- Listagem de produtos
- Página de detalhes
- Carrinho de compras (localStorage)

### Carrinho
- Adicionar / remover itens
- Alterar quantidade
- Cálculo automático de total
- Validação antes do checkout

### Blog de Receitas
- Listagem de receitas
- Página detalhada
- Exibição de ingredientes e preparo

### Perfil
- Dados do usuário
- Histórico de transações (integração com API)

---

## Arquitetura

O projeto foi estruturado separando responsabilidades:

```txt
LinguRemi/
 ├── LinguRemi-FrontEnd  → Interface React
 └── LinguRemiAPI        → API Spring Boot
```

### Front-end
- Componentes reutilizáveis
- Services para consumo da API
- Context global para controle de autenticação (modal)
- Tipagem forte com TypeScript

### Back-end
- API REST
- Autenticação via JWT
- Configuração de segurança com Spring Security
- Estrutura preparada para expansão
---
## Configuração
Front-end
```bash
cd LinguRemi-FrontEnd
npm install
npm run dev
```
Crie um .env
```bash
VITE_API_URL=http://localhost:8080
```
Back-end
```bash
cd LinguRemiAPI
./mvnw spring-boot:run
```
---
## Segurança
- Autenticação via JWT
- Rotas protegidas
- CORS configurado
- Estrutura preparada para melhorias (roles, validações, etc)
---
## Melhorias futuras
- Integração com pagamento
- Upload de imagens
- Melhorias de UX/UI
- Sistema de pedidos completo
- Deploy em produção (front + API)
---
## Observações
Este projeto está em desenvolvimento contínuo como parte do aprendizado em desenvolvimento full stack e evolução da aplicação.
