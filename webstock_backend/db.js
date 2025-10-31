const mysql = require('mysql2/promise');

// Configurações do banco de dados
// ATENÇÃO: Você DEVE alterar estas credenciais para as suas configurações reais do MySQL.
const dbConfig = {
    host: 'localhost',
    user: 'root', // Altere para o seu usuário MySQL
    password: 'password', // Altere para a sua senha MySQL
    database: 'webstock_db'
};

// Cria um pool de conexões para melhor performance e gerenciamento
const pool = mysql.createPool(dbConfig);

// Função para testar a conexão
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("Conexão com o MySQL estabelecida com sucesso!");
        connection.release(); // Libera a conexão de volta para o pool
    } catch (error) {
        console.error("Erro ao conectar ao MySQL:", error.message);
        // Em um ambiente real, você pode querer sair do processo se a conexão for crítica
        // process.exit(1);
    }
}

// Exporta o pool para ser usado em outras partes da aplicação
module.exports = {
    pool,
    testConnection
};
