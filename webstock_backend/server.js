const express = require('express');
const bcrypt = require('bcrypt');
const { pool, testConnection } = require('./db'); // Importa a conexão com o banco de dados

const app = express();
const PORT = 3000;
const saltRounds = 10; // Fator de segurança para o bcrypt

// Middleware para processar JSON no corpo das requisições
app.use(express.json());

// Middleware de CORS (necessário para que o frontend em HTML/JS possa se comunicar)
app.use((req, res, next) => {
    // Em produção, substitua '*' pelo domínio do seu frontend (ex: 'http://localhost:8080')
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Testa a conexão com o banco de dados ao iniciar o servidor
testConnection();

// Rota de Login de Usuário
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
    }

    try {
        // 1. Buscar o usuário pelo email
        const [rows] = await pool.execute(
            'SELECT id, senha_hash FROM usuarios WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            // Usuário não encontrado
            return res.status(401).json({ erro: 'Email ou senha inválidos.' });
        }

        const usuario = rows[0];

        // 2. Comparar a senha fornecida com o hash armazenado
        const match = await bcrypt.compare(senha, usuario.senha_hash);

        if (match) {
            // 3. Senha correta, login bem-sucedido
            // Em um ambiente real, você geraria um JWT (JSON Web Token) aqui para autenticação
            res.status(200).json({ 
                mensagem: 'Login realizado com sucesso!', 
                usuarioId: usuario.id,
                // token: 'SEU_JWT_AQUI' // Exemplo de token
            });
        } else {
            // 4. Senha incorreta
            return res.status(401).json({ erro: 'Email ou senha inválidos.' });
        }

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ erro: 'Erro interno do servidor ao tentar login.' });
    }
});

// Rota de Cadastro de Usuário
app.post('/api/cadastro', async (req, res) => {
    const { email, senha } = req.body;

    // Validação básica (o frontend já faz, mas é crucial no backend)
    if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
    }

    try {
        // 1. Gerar o hash da senha
        const senhaHash = await bcrypt.hash(senha, saltRounds);

        // 2. Inserir o novo usuário no banco de dados
        const [result] = await pool.execute(
            'INSERT INTO usuarios (email, senha_hash) VALUES (?, ?)',
            [email, senhaHash]
        );

        // 3. Responder com sucesso
        res.status(201).json({ 
            mensagem: 'Usuário cadastrado com sucesso!', 
            usuarioId: result.insertId 
        });

    } catch (error) {
        console.error('Erro no cadastro:', error);

        // Tratar erro de email duplicado (código de erro 1062 no MySQL)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ erro: 'Este email já está cadastrado.' });
        }

        res.status(500).json({ erro: 'Erro interno do servidor ao cadastrar usuário.' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}./index.html`);
});
