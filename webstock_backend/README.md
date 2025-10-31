# Backend WebStock (Node.js + Express + MySQL)

Este projeto implementa o backend necessário para as funcionalidades de Cadastro e Login do seu site WebStock, utilizando **Node.js**, o framework **Express** e o banco de dados **MySQL**.

## 1. Pré-requisitos

1.  **Node.js e npm:** Instalados na sua máquina.
2.  **MySQL Server:** Instalado e em execução.
3.  **Banco de Dados `webstock_db`:** Criado e com a tabela `usuarios` configurada (utilize o script `webstock_db_script.sql` que foi fornecido anteriormente).

## 2. Configuração

### A. Dependências

Certifique-se de que as dependências do projeto estão instaladas:

```bash
cd webstock_backend
npm install
```

### B. Configuração do Banco de Dados

Você **DEVE** editar o arquivo `db.js` com suas credenciais reais do MySQL.

**`db.js` (Ajuste as linhas 7, 8 e 9):**

```javascript
// ...
const dbConfig = {
    host: 'localhost',
    user: 'root', // <-- Seu usuário MySQL
    password: 'sua_senha_aqui', // <-- Sua senha MySQL
    database: 'webstock_db'
};
// ...
```

## 3. Execução do Servidor

Para iniciar o servidor backend, execute o seguinte comando no terminal, dentro da pasta `webstock_backend`:

```bash
node server.js
```

O servidor será iniciado na porta **3000**. Você verá a mensagem: `Servidor rodando em http://localhost:3000` (e a confirmação de conexão com o MySQL).

## 4. Rotas da API

O backend expõe duas rotas principais para autenticação:

| Rota | Método | Descrição | Corpo da Requisição (JSON) | Resposta de Sucesso |
| :--- | :--- | :--- | :--- | :--- |
| `/api/cadastro` | `POST` | Registra um novo usuário. | `{"email": "novo@email.com", "senha": "SenhaForte123!"}` | `{"mensagem": "Usuário cadastrado com sucesso!", "usuarioId": 1}` |
| `/api/login` | `POST` | Autentica um usuário existente. | `{"email": "usuario@existente.com", "senha": "SenhaForte123!"}` | `{"mensagem": "Login realizado com sucesso!", "usuarioId": 1}` |

## 5. Integração com o Frontend (Seu HTML/JS)

Para que o seu frontend se comunique com este backend, você precisará modificar o JavaScript em `js/confirmacao.js` ou criar um novo arquivo para enviar os dados de cadastro/login para as rotas da API.

### Exemplo de Alteração no Frontend (Cadastro)

No seu arquivo de JavaScript (onde você tem a lógica de validação), você precisará adicionar uma requisição `fetch` ou `XMLHttpRequest` para enviar os dados para o backend após a validação ser bem-sucedida.

**Exemplo de como seria a lógica de envio (após a validação no frontend):**

```javascript
// ... dentro da função que lida com o clique do botão de cadastro ...

if (validacao.valida) {
    // Dados validados, enviar para o backend
    fetch('http://localhost:3000/api/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.erro) {
            // Tratar erros do servidor (ex: email já cadastrado)
            alert('Erro no cadastro: ' + data.erro);
        } else {
            // Sucesso
            alert(data.mensagem);
            window.location.href = './login.html'; // Redirecionar para login
        }
    })
    .catch(error => {
        console.error('Erro de rede:', error);
        alert('Erro ao comunicar com o servidor.');
    });
}

// ...
```

Você deve aplicar uma lógica similar para a rota `/api/login`.
