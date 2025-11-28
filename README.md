# 🥗 Vitalia - Backend

Este repositório contém o código do servidor (backend) do projeto **Vitalia**. A API foi construída utilizando **Node.js** e **Express**, integrada a um banco de dados **MySQL** para gerenciar usuários, autenticação e o sistema de gamificação (pontuação e ranking).

## 🚀 Tecnologias Utilizadas

* **Node.js**: Ambiente de execução JavaScript.
* **Express**: Framework para construção da API.
* **MySQL2**: Cliente para conexão com o banco de dados.
* **Cors**: Middleware para habilitar requisições de diferentes origens.
* **Vercel**: Configurado para deploy serverless.

---

## 📂 Estrutura do Projeto

```bash
VITALIA-BACKEND/
├── api/
│   └── index.js       # Arquivo principal da aplicação (Rotas e Configuração)
├── node_modules/      # Dependências do projeto
├── .gitignore         # Arquivos ignorados pelo Git
├── package.json       # Gerenciador de dependências e scripts
├── package-lock.json  # Versões exatas das dependências
└── vercel.json        # Configuração de deploy para Vercel
````

-----

## 🛠️ Como rodar o projeto localmente

1.  **Clone o repositório:**

    ```bash
    git clone [https://github.com/accacioArodrigues22a/vitalia.git](https://github.com/accacioArodrigues22a/vitalia.git)
    cd vitalia
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Inicie o servidor:**

    ```bash
    node api/index.js
    ```

    *O servidor rodará na porta `3333`.*

-----

## 🔗 Documentação da API

### 1\. Status da API

Verifica se o backend está online.

  - **Rota:** `GET /`
  - **Resposta:**
    ```text
    ✅ Backend Vitalia Funcionando! Use as rotas /api/login, /api/cadastrar, etc.
    ```

### 2\. Cadastro de Usuário

Registra um novo usuário no banco de dados.

  - **Rota:** `POST /api/cadastrar`
  - **Body (JSON):**
    ```json
    {
      "nome": "Seu Nome",
      "email": "seuemail@exemplo.com",
      "senha": "suasenha123"
    }
    ```

### 3\. Login

Autentica o usuário e retorna o ID para controle de sessão.

  - **Rota:** `POST /api/login`
  - **Body (JSON):**
    ```json
    {
      "email": "seuemail@exemplo.com",
      "senha": "suasenha123"
    }
    ```

### 4\. Salvar Pontuação

Atualiza a pontuação do usuário (apenas se a nova pontuação for maior que a atual).

  - **Rota:** `POST /api/salvar-pontuacao`
  - **Body (JSON):**
    ```json
    {
      "userId": 1,
      "pontos": 150
    }
    ```

### 5\. Ranking

Retorna os 3 melhores jogadores com base na pontuação (`score`).

  - **Rota:** `GET /api/ranking`
  - **Resposta (Exemplo):**
    ```json
    [
      { "name": "Maria", "score": 500 },
      { "name": "João", "score": 450 },
      { "name": "Pedro", "score": 300 }
    ]
    ```

-----

## ☁️ Deploy (Vercel)

Este projeto possui um arquivo `vercel.json` configurado para deploy serverless.

A estrutura de rotas no Vercel redireciona todo o tráfego para a pasta `/api`.

-----

## 📝 Licença

Este projeto foi desenvolvido para fins acadêmicos.