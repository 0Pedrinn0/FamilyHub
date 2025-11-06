const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json())

const db = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"12345",
    database:"db_familyHub"
})

app.post('/cadastrar', (req, res) => {
    const { nome_usuario, senha_usuario, email_usuario } = req.body;
    console.log('Recebido:', nome_usuario, email_usuario);

    db.query('INSERT INTO tb_usuario (nome_usuario, senha_usuario, email_usuario) VALUES (?, ?, ?)',
    [ nome_usuario, senha_usuario, email_usuario ],
    (err, result) => {
        if (err) return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
        res.json({ message: `Usuário cadastrado com sucesso!` });
    });
});

app.post('/login', (req, res) => {
    const { nome_usuario, senha_usuario } = req.body;
    console.log('Tentativa de login:', nome_usuario);

    if (!nome_usuario || !senha_usuario) {
        return res.status(400).json({ message: 'Nome ou senha não informados.' });
    }

    db.query(
        'SELECT * FROM tb_usuario WHERE nome_usuario = ? AND senha_usuario = ?',
        [ nome_usuario, senha_usuario ],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao verificar usuário.' });
            }

            if (results.length > 0) {
                const user = results[0];
                return res.json({ message: 'Login realizado com sucesso.', user: { id: user.id_usuario || user.id, nome_usuario: user.nome_usuario } });
            }

            return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
        }
    );
});

app.get('/lista', (req, res) => {
    db.query('SELECT * FROM tb_lista_compra ORDER BY comprado_listaCompra ASC, id_listaCompra DESC',
    (err, results) => {
        if (err) return res.status(500).json({ message: 'Erro ao buscar lista.' });
        res.json(results);
    });
});

app.post('/lista/adicionar', (req, res) => {
    console.log('Dados recebidos:', req.body);
    
    const { nome_listaCompra, quantidade_listaCompra, descricao_listaCompra } = req.body;
    
    db.query('INSERT INTO tb_lista_compra (nome_listaCompra, quantidade_listaCompra, descricao_listaCompra, comprado_listaCompra) VALUES (?, ?, ?, false)',
    [nome_listaCompra, quantidade_listaCompra, descricao_listaCompra],
    (err, result) => {
        if (err) {
            console.error('Erro SQL:', err);
            return res.status(500).json({ message: 'Erro ao adicionar item.' });
        }
        res.json({ message: 'Item adicionado com sucesso!', id: result.insertId });
    });
});

app.put('/lista/editar/:id', (req, res) => {
    const { quantidade_listaCompra } = req.body;
    const id = req.params.id;
    
    db.query('UPDATE tb_lista_compra SET quantidade_listaCompra = ? WHERE id_listaCompra = ?',
    [quantidade_listaCompra, id],
    (err) => {
        if (err) return res.status(500).json({ message: 'Erro ao atualizar item.' });
        res.json({ message: 'Item atualizado com sucesso!' });
    });
});

app.put('/lista/marcar/:id', (req, res) => {
    const id = req.params.id;
    
    db.query('UPDATE tb_lista_compra SET comprado_listaCompra = NOT comprado_listaCompra WHERE id_listaCompra = ?',
    [id],
    (err) => {
        if (err) return res.status(500).json({ message: 'Erro ao marcar item.' });
        res.json({ message: 'Status do item atualizado!' });
    });
});

app.delete('/lista/deletar/:id', (req, res) => {
    const id = req.params.id;
    
    db.query('DELETE FROM tb_lista_compra WHERE id_listaCompra = ?',
    [id],
    (err) => {
        if (err) return res.status(500).json({ message: 'Erro ao deletar item.' });
        res.json({ message: 'Item deletado com sucesso!' });
    });
});

app.get('/lembretes', (req, res) => {
    db.query('SELECT * FROM tb_lembrete ORDER BY data_lembrete ASC, horario_lembrete ASC',
    (err, results) => {
        if (err) return res.status(500).json({ message: 'Erro ao buscar lembretes.' });
        res.json(results);
    });
});

app.get('/lembretes/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM tb_lembrete WHERE id_lembrete = ?',
    [id],
    (err, results) => {
        if (err) return res.status(500).json({ message: 'Erro ao buscar lembrete.' });
        if (results.length === 0) return res.status(404).json({ message: 'Lembrete não encontrado.' });
        res.json(results[0]);
    });
});

app.post('/lembretes/adicionar', (req, res) => {
    const { titulo_lembrete, discricao_lembrete, data_lembrete, horario_lembrete } = req.body;
    
    db.query('INSERT INTO tb_lembrete (titulo_lembrete, discricao_lembrete, data_lembrete, horario_lembrete) VALUES (?, ?, ?, ?)',
    [titulo_lembrete, discricao_lembrete, data_lembrete, horario_lembrete],
    (err, result) => {
        if (err) {
            console.error('Erro SQL:', err);
            return res.status(500).json({ message: 'Erro ao adicionar lembrete.' });
        }
        res.json({ message: 'Lembrete adicionado com sucesso!', id: result.insertId });
    });
});

app.put('/lembretes/editar/:id', (req, res) => {
    const { titulo_lembrete, discricao_lembrete, data_lembrete, horario_lembrete } = req.body;
    const id = req.params.id;
    
    db.query('UPDATE tb_lembrete SET titulo_lembrete = ?, discricao_lembrete = ?, data_lembrete = ?, horario_lembrete = ? WHERE id_lembrete = ?',
    [titulo_lembrete, discricao_lembrete, data_lembrete, horario_lembrete, id],
    (err) => {
        if (err) return res.status(500).json({ message: 'Erro ao atualizar lembrete.' });
        res.json({ message: 'Lembrete atualizado com sucesso!' });
    });
});

app.delete('/lembretes/deletar/:id', (req, res) => {
    const id = req.params.id;
    
    db.query('DELETE FROM tb_lembrete WHERE id_lembrete = ?',
    [id],
    (err) => {
        if (err) return res.status(500).json({ message: 'Erro ao deletar lembrete.' });
        res.json({ message: 'Lembrete deletado com sucesso!' });
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000🎂");
})