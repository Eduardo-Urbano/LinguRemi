# 🍰 LinguRémi

Projeto full stack de uma doceria gourmet desenvolvido com foco em experiência digital, integração entre front-end moderno e back-end robusto com Java Spring Boot.

O sistema simula uma plataforma digital de doceria com catálogo, receitas, gerenciamento de dados, autenticação e documentação profissional de API com Swagger/OpenAPI.

---

# Deploy em Produção

### Front-end:
https://linguremi.vercel.app

### API (Spring Boot):
https://linguremi-api.onrender.com

### Swagger / Documentação da API:
https://linguremi-api.onrender.com/swagger-ui/index.html

### Health Check:
https://linguremi-api.onrender.com/health

---

## Visão Geral

O LinguRémi foi desenvolvido para consolidar conhecimentos em desenvolvimento full stack, separando claramente:

### Front-end
- Interface moderna
- Navegação responsiva
- Catálogo visual
- Integração dinâmica com API

### Back-end
- API REST
- Login e cadastro
- Receitas
- Produtos
- Histórico
- H2 Database
- Swagger/OpenAPI
- Deploy em produção

---

## Tecnologias Utilizadas

### Front-end
- TypeScript
- JavaScript
- Tailwind CSS
- HTML5

### Back-end
- Java
- Spring Boot
- Spring Security
- H2 Database
- Swagger / OpenAPI
- Render

---

## Estrutura do Projeto

```bash
LinguRemi/
│
├── public/              # Front-end
├── src/                 # Código principal front-end
├── LinguRemiAPI/        # API Spring Boot
│
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

---


## Como Executar

Front-end
```bash
npm install
npm run dev
```
URL:
```http
http://localhost:5173
```

---

Back-end estará disponivel em:
```http
https://linguremi-api.onrender.com
```
OBS: Por der um serviço de hospedagem gratuito, a primeira requisição pode demorar alguns segundos

---

## Swagger / OpenAPI
A documentação completa da API está disponível em:
```http
https://linguremi-api.onrender.com/swagger-ui/index.html
```
Inclui:
- Endpoints
- Métodos
- Rotas públicas e privadas
- Testes diretos
- Estrutura de autenticação

---

## Health Check
```http
GET /health
```

Resposta:
```json
{
  "status": "ok",
  "service": "LinguRemi API"
}
```

---

## Funcionalidades

Front-end:
- Landing page responsiva
- Catálogo de doces
- Receitas dinâmicas
- Estrutura visual moderna
- Consumo de API

Back-end:
- Cadastro de usuários
- Login
- Produtos
- Receitas
- Histórico
- Uploads
- Segurança com Spring Security
- Documentação Swagger

---

## Boas Práticas Aplicadas
- Separação front/back
- API REST
- Swagger/OpenAPI
- Spring Security
- Deploy em produção
- Health Check
- Organização modular
- Versionamento GitHub

---

## Contexto
Projeto iniciado academicamente e expandido como projeto de portfólio, com foco em evolução prática para desenvolvimento full stack profissional.

---

## Licença
MIT