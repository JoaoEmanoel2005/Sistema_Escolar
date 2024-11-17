const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    router.post('/cadastro', (req, res) => {
        const { nome, email, senha, cod_rec } = req.body;
        db.run(`INSERT INTO usuarios (nome, email, senha, cod_rec) VALUES (?, ?, ?, ?)`,
            [nome, email, senha, cod_rec], function (err) {
                if (err) {
                    return res.status(400).send(err.message);
                }
                res.status(201).json({ id: this.lastID });
            });
    });
    
    router.get('/perfil', (req, res) => {
        const id = usuarioId;  // Supondo que você tenha uma forma de identificar o usuário autenticado
    
        if (!id) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }
    
        db.get(`SELECT nome, email, senha FROM usuarios WHERE id = ?`, [id], (err, row) => {
            if (err || !row) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
    
            // Retorna os dados do usuário (nome, email, senha)
            res.status(200).json({
                usuario: {
                    nome: row.nome,
                    email: row.email,
                    senha: row.senha  // Retorne a senha como você está fazendo, se for necessário (em produção, evite)
                }
            });
        });
    });
    

    router.get('/', (req, res) => {
        db.all(`SELECT * FROM usuarios`, [], (err, rows) => {
            if (err) {
                return res.status(400).send(err.message);
            }
            res.json(rows);
        });
    });

    router.put('/:id', (req, res) => {
        const { id } = req.params;
        const { nome, email, senha, cod_rec } = req.body;
        db.run(`UPDATE usuarios SET nome = ?, email = ?, senha = ?, cod_rec = ? WHERE id = ?`,
            [nome, email, senha, cod_rec, id], function (err) {
                if (err) {
                    return res.status(400).send(err.message);
                }
                res.send(`Usuário ${id} atualizado`);
            });
    });
  
    router.delete('/:id', (req, res) => {
        const { id } = req.params;
        db.run(`DELETE FROM usuarios WHERE id = ?`, id, function (err) {
            if (err) {
                return res.status(400).send(err.message);
            }
            res.send(`Usuário ${id} deletado`);
        });
    });

    return router;
};

