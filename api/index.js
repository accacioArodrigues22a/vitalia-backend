const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

// --- CORREÇÃO DO CORS ---
// Não use "*", use true para permitir credenciais (cookies) sem travar
app.use(cors({
    origin: true, 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

// ==================================================================
// 1. CONEXÃO COM O BANCO (POOL)
// ==================================================================
const db = mysql.createPool({
    host: 'benserverplex.ddns.net',
    user: 'alunos',
    password: 'senhaAlunos',
    database: 'web_02ta',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ==================================================================
// 2. CRIAÇÃO DO ROTEADOR (A Mágica da Vercel) ✨
// ==================================================================
const router = express.Router();

// --- ROTA DE CADASTRO ---
router.post('/cadastrar', (req, res) => {
    const { nome, email, senha } = req.body; // Simplifiquei a leitura
    
    if (!senha || !nome || !email) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    db.query("SELECT email FROM vitalia_usuarios WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).json({ error: "Erro ao verificar email." });
        if (results.length > 0) return res.status(400).json({ error: "E-mail já cadastrado!" });

        const sqlInsert = "INSERT INTO vitalia_usuarios (name, email, password, score) VALUES (?, ?, ?, 0)";
        db.query(sqlInsert, [nome, email, senha], (err) => {
            if (err) return res.status(500).json({ error: "Erro ao cadastrar." });
            res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
        });
    });
});

// --- ROTA DE LOGIN ---
router.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const sql = "SELECT * FROM vitalia_usuarios WHERE email = ? AND password = ?";

    db.query(sql, [email, senha], (err, results) => {
        if (err) return res.status(500).json({ error: "Erro interno." });
        
        if (results.length > 0) {
            const usuario = results[0];
            res.json({ message: "Login realizado", id: usuario.id, nome: usuario.name });
        } else {
            res.status(401).json({ error: "E-mail ou senha incorretos." });
        }
    });
});

// --- ROTA PONTUAÇÃO ---
router.post('/salvar-pontuacao', (req, res) => {
    const { userId, pontos } = req.body;
    if (!userId) return res.status(400).json({ error: "ID obrigatório" });

    const sqlSelect = "SELECT score FROM vitalia_usuarios WHERE id = ?";
    db.query(sqlSelect, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Erro ao buscar pontuação" });

        if (results.length > 0) {
            const currentScore = results[0].score || 0;
            if (pontos > currentScore) {
                const sqlUpdate = "UPDATE vitalia_usuarios SET score = ? WHERE id = ?";
                db.query(sqlUpdate, [pontos, userId], (err) => {
                    if (err) return res.status(500).json({ error: "Erro ao atualizar" });
                    res.json({ message: "Novo recorde salvo!", newRecord: true });
                });
            } else {
                res.json({ message: "Pontuação menor que o recorde.", newRecord: false });
            }
        } else {
            res.status(404).json({ error: "Usuário não encontrado" });
        }
    });
});

// --- ROTA RANKING ---
router.get('/ranking', (req, res) => {
    const sql = "SELECT name, score FROM vitalia_usuarios ORDER BY score DESC LIMIT 3";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Erro ranking" });
        res.json(results);
    });
});

// ==================================================================
// 3. REGISTRAR O ROTEADOR NA ROTA /api
// ==================================================================
app.use('/api', router);

// ==================================================================
// 4. INICIALIZAÇÃO (Híbrido)
// ==================================================================
if (require.main === module) {
    // Se for local, rodamos na 3333 e ignoramos o /api interno
    // Mas para funcionar igual a Vercel, você pode acessar localhost:3333/api/ranking
    app.listen(3333, () => console.log('🚀 Backend na porta 3333'));
}

module.exports = app;