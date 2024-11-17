const express = require('express'); // importa o express
const sqlite3 = require('sqlite3').verbose(); // importa os comandos pra usar o SQLite
const cors = require('cors'); // Importar o pacote cors

const app = express();
app.use(cors()); 
app.use(express.json());
const port = 3000;

// Criar ou abre o banco de dados SQLite (neste teste é usuarios.db)
const db = new sqlite3.Database('./sist_esco.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados Sistema Escolar.');

        // Ativar suporte a chaves estrangeiras
        db.run(`PRAGMA foreign_keys = ON;`, (err) => {
            if (err) {
                console.error('Erro ao ativar chaves estrangeiras:', err.message);
            } else {
                console.log('Chaves estrangeiras ativadas.');
            }
        });
    }
});

// Criar a tabela 'usuarios' se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS usuario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        cod_rec TEXT NOT NULL
    );`, (err) => {
        if (err) {
            console.error('Erro ao criar tabela usuarios:', err.message);
        }
    });

// Criar a tabela 'aquario' se não existir
/* db.run(`
    CREATE TABLE IF NOT EXISTS aquario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        codigo TEXT UNIQUE NOT NULL,
        modelo TEXT NOT NULL,
        usuario_id INTEGER,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );`, (err) => {
        if (err) {
            console.error('Erro ao criar tabela aquario:', err.message);
        }
    });

// Criar a tabela 'dados' se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS dados (
        temperatura TEXT NOT NULL,
        horario TEXT NOT NULL,
        aquario_id INTEGER,
        FOREIGN KEY (aquario_id) REFERENCES aquario(id) ON DELETE CASCADE
    );`, (err) => {
        if (err) {
            console.error('Erro ao criar tabela dados:', err.message);
        }
    });
*/
const usuariosRoutes = require('./routes/usuarios')(db);
const authRoutes = require('./routes/auth')(db); // Adicionando as rotas de autenticação

app.use('/usuarios', usuariosRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
