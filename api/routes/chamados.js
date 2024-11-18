import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import { check, validationResult } from 'express-validator';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'ferramentasChamados';
const router = express.Router();

// Função para conectar ao banco de dados
async function connectToDatabase() {
    try {
        await client.connect();
        console.log(`Conectado ao database ${dbName}`);
    } catch (err) {
        console.error(`Erro ao conectar: ${err.message}`);
    }
}

function generateRandomNumber() {
    return Math.floor(Math.random() * 99999) + 1;
}

// Validações de chamado
const validaChamado = [
    check('titulo').not().isEmpty().withMessage('O título é obrigatório'),
    check('descricao').not().isEmpty().withMessage('A descrição é obrigatória'),
    check('prioridade').isInt({ min: 1 }).withMessage('A prioridade deve ser um número inteiro'),
    check('categoria').not().isEmpty().withMessage('A descrição é obrigatória'),
    check('departamento').not().isEmpty().withMessage('O departamento é obrigatória')
    //check('status').notEmpty().withMessage('O status é obrigatório')
];

// GET: Listar todos os chamados
router.get('/', async (req, res) => {
    try {
        await connectToDatabase();
        const db = client.db(dbName);
        const chamados = db.collection('chamados');
        const result = await chamados.find().toArray();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ "error": `${err.message}` });
    }
});

// GET: Obter chamado por ID
router.get('/id/:id', async (req, res) => {
    try {
        await connectToDatabase();
        const db = client.db(dbName);
        const chamados = db.collection('chamados');
        const result = await chamados.findOne({ _id: new ObjectId(req.params.id) });
        if (!result) {
            return res.status(404).json({ message: 'Chamado não encontrado' });
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ "error": `${err.message}` });
    }
});

// POST: Criar um novo chamado
router.post('/', validaChamado, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { titulo, descricao, prioridade, responsavel, categoria, departamento } = req.body;

    try {
        await connectToDatabase();
        const db = client.db(dbName);
        const chamados = db.collection('chamados');

        let codigo = generateRandomNumber();
        let status = 'Em Triagem';

        const novoChamado = { codigo, titulo, descricao, prioridade, status, responsavel, categoria, departamento, dataCriacao: new Date() };
        const result = await chamados.insertOne(novoChamado);
        res.status(201).json({ message: 'Chamado inserido com sucesso', id: result.insertedId });
    } catch (err) {
        res.status(500).json({ "error": `${err.message}` });
    }
});

// PUT: Atualizar um chamado existente
router.put('/:id', validaChamado, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        await connectToDatabase();
        const db = client.db(dbName);
        const chamados = db.collection('chamados');
        const { id } = req.params;
        const result = await chamados.updateOne(
            { _id: new ObjectId(id) },
            { $set: req.body }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Chamado não encontrado' });
        }
        res.status(200).json({ message: 'Chamado atualizado com sucesso' });
    } catch (err) {
        res.status(500).json({ "error": `${err.message}` });
    }
});

// DELETE: Remover um chamado
router.delete('/:id', async (req, res) => {
    try {
        await connectToDatabase();
        const db = client.db(dbName);
        const chamados = db.collection('chamados');
        const { id } = req.params;
        const result = await chamados.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Chamado não encontrado' });
        }
        res.status(200).json({ message: 'Chamado removido com sucesso' });
    } catch (err) {
        res.status(500).json({ "error": `${err.message}` });
    }
});

export default router;
