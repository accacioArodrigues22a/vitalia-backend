
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

app.use(cors({
    origin: true, 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

const db = mysql.createPool({
    host: 'benserverplex.ddns.net',
    user: 'alunos',
    password: 'senhaAlunos',
    database: 'web_02ta',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


app.get('/', (req, res) => {
    res.send('✅ Backend Vitalia Funcionando! Use as rotas /api/login, /api/cadastrar, etc.');
});


const router = express.Router();

router.post('/cadastrar', (req, res) => {
    const { nome, email, senha } = req.body;
    if (!senha || !nome || !email) return res.status(400).json({ error: "Campos obrigatórios." });

    db.query("SELECT email FROM vitalia_usuarios WHERE email = ?", [email], (err, results) => {
        if (err) { console.error(err); return res.status(500).json({ error: "Erro banco." }); }
        if (results.length > 0) return res.status(400).json({ error: "E-mail já cadastrado!" });

        db.query("INSERT INTO vitalia_usuarios (name, email, password, score) VALUES (?, ?, ?, 0)", [nome, email, senha], (err) => {
            if (err) { console.error(err); return res.status(500).json({ error: "Erro cadastro." }); }
            res.status(201).json({ message: "Sucesso!" });
        });
    });
});

router.post('/login', (req, res) => {
    const { email, senha } = req.body;
    db.query("SELECT * FROM vitalia_usuarios WHERE email = ? AND password = ?", [email, senha], (err, results) => {
        if (err) { console.error(err); return res.status(500).json({ error: "Erro interno." }); }
        if (results.length > 0) {
            res.json({ message: "Login OK", id: results[0].id, nome: results[0].name });
        } else {
            res.status(401).json({ error: "Login incorreto." });
        }
    });
});

router.post('/salvar-pontuacao', (req, res) => {
    const { userId, pontos } = req.body;
    if (!userId) return res.status(400).json({ error: "ID obrigatório" });
    
    db.query("SELECT score FROM vitalia_usuarios WHERE id = ?", [userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Erro banco" });
        if (results.length > 0) {
            if (pontos > results[0].score) {
                db.query("UPDATE vitalia_usuarios SET score = ? WHERE id = ?", [pontos, userId], (err) => {
                    if (err) return res.status(500).json({ error: "Erro update" });
                    res.json({ newRecord: true });
                });
            } else {
                res.json({ newRecord: false });
            }
        } else {
            res.status(404).json({ error: "User não achado" });
        }
    });
});

router.get('/ranking', (req, res) => {
    db.query("SELECT name, score FROM vitalia_usuarios ORDER BY score DESC LIMIT 3", (err, results) => {
        if (err) { console.error(err); return res.status(500).json({ error: "Erro ranking" }); }
        res.json(results);
    });
});

app.use('/api', router);
app.use('/', router); 

if (require.main === module) {
    app.listen(3333, () => console.log('🚀 Backend rodando porta 3333'));
}

module.exports = app;