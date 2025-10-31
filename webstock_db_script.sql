-- Script SQL para criação do banco de dados WebStock e suas tabelas
-- Este script é baseado na análise dos arquivos HTML e JavaScript fornecidos.

-- 1. Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS webstock_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Seleciona o banco de dados para uso
USE webstock_db;

-- 2. Tabela de Usuários (para Login e Cadastro)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL, -- Armazenar a senha como hash (NUNCA em texto puro!)
    nome VARCHAR(100), -- Adicional: Nome do usuário
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE
);

-- 3. Tabela de Itens em Estoque (baseado em categorias.html)
CREATE TABLE IF NOT EXISTS itens_estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    status ENUM('Ativo', 'Inativo') NOT NULL DEFAULT 'Ativo', -- Baseado na coluna 'Status'
    quantidade INT NOT NULL DEFAULT 0, -- Baseado na coluna 'Quant.'
    data_registro DATE, -- Baseado na coluna 'Data'
    materia VARCHAR(100), -- Baseado na coluna 'Matéria' (pode ser categoria, departamento, etc.)
    observacao TEXT, -- Baseado na coluna 'Obs.'
    usuario_id INT, -- Chave estrangeira para rastrear quem registrou/modificou
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- 4. Dados de Exemplo (Opcional, para testar a estrutura)

-- Inserir um usuário de exemplo (a senha 'senha123' deve ser hasheada na aplicação real)
-- Usando a função PASSWORD() do MySQL apenas para fins de demonstração em um script,
-- mas o ideal é que o hash seja gerado pela aplicação (ex: bcrypt).
INSERT INTO usuarios (email, senha_hash, nome) VALUES
('teste@webstock.com.br', 'senha_deve_ser_hasheada', 'Usuário Teste');

-- Inserir dados de estoque de exemplo
INSERT INTO itens_estoque (nome, status, quantidade, data_registro, materia, observacao, usuario_id) VALUES
('Notebook', 'Ativo', 200, '2025-06-07', 'Curso Dev', 'Formatar a máquina 17', 1),
('Mouse', 'Inativo', 30, '2025-04-30', 'Curso Dev', 'Manutenção Necessária', 1),
('Caderno', 'Ativo', 410, '2024-11-19', 'Regular', 'Necessita de Reposição', 1),
('Mochila', 'Inativo', 270, '2025-06-02', '-', '-', 1),
('Régua', 'Inativo', 130, '2025-05-04', 'Regular', 'Necessita de Reposição', 1),
('Caneta', 'Ativo', 110, '2025-02-12', 'Regular', '-', 1),
('Lápis', 'Ativo', 0, '2025-03-29', 'Regular', '-', 1);
