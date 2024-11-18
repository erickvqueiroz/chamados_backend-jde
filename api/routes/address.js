import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import { check, validationResult } from 'express-validator';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'Address';
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

// Validações do cadastro de usuário
const validaUsuario = [
    check('fullName').not().isEmpty().withMessage('O nome completo é obrigatório'),
    check('cpf').isLength({ min: 14, max: 14 }).withMessage('O CPF é obrigatório e deve estar no formato correto'),
    check('age').isInt({ min: 0 }).withMessage('A idade deve ser um número inteiro positivo'),
    check('phone').not().isEmpty().withMessage('O telefone é obrigatório'),
    check('address').not().isEmpty().withMessage('O endereço é obrigatório'),
    check('email').isEmail().withMessage('E-mail inválido'),
    check('password').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres')
];

// POST: Criar um novo usuário
router.post('/', validaUsuario, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, cpf, age, phone, address, email, password } = req.body;

    try {
        await connectToDatabase();
        const db = client.db(dbName);
        const usuarios = db.collection('usuarios');

        // Verificar se o CPF já existe
        const cpfExistente = await usuarios.findOne({ cpf });
        if (cpfExistente) {
            return res.status(400).json({ message: 'CPF já cadastrado' });
        }

        // Verificar se o e-mail já existe
        const emailExistente = await usuarios.findOne({ email });
        if (emailExistente) {
            return res.status(400).json({ message: 'E-mail já cadastrado' });
        }

        const novoUsuario = { fullName, cpf, age, phone, address, email, password, dataCriacao: new Date() };
        const result = await usuarios.insertOne(novoUsuario);

        res.status(201).json({ message: 'Usuário cadastrado com sucesso', id: result.insertedId });
    } catch (err) {
        res.status(500).json({ "error": `${err.message}` });
    }
});

// GET: Listar todos os usuários
router.get('/', async (req, res) => {
    try {
        await connectToDatabase();
        const db = client.db(dbName);
        const usuarios = db.collection('usuarios');
        const result = await usuarios.find().toArray();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ "error": `${err.message}` });
    }
});

// GET: Obter usuário por ID
router.get('/id/:id', async (req, res) => {
    try {
        await connectToDatabase();
        const db = client.db(dbName);
        const usuarios = db.collection('usuarios');
        const result = await usuarios.findOne({ _id: new ObjectId(req.params.id) });
        if (!result) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ "error": `${err.message}` });
    }
});

// PUT: Atualizar um usuário existente
router.put('/:id', validaUsuario, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, cpf, age, phone, address, email, password } = req.body;

    try {
        await connectToDatabase();
        const db = client.db(dbName);
        const usuarios = db.collection('usuarios');

        // Verificar se o CPF ou e-mail já existe em outro documento
        const usuarioExistente = await usuarios.findOne({ 
            $or: [{ cpf }, { email }],
            _id: { $ne: new ObjectId(req.params.id) }
        });

        if (usuarioExistente) {
            return res.status(400).json({ message: 'CPF ou E-mail já cadastrado por outro usuário' });
        }

        const result = await usuarios.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { fullName, cpf, age, phone, address, email, password } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json({ message: 'Usuário atualizado com sucesso' });
    } catch (err) {
        res.status(500).json({ "error": `${err.message}` });
    }
});

// DELETE: Remover um usuário
router.delete('/:id', async (req, res) => {
    try {
        await connectToDatabase();
        const db = client.db(dbName);
        const usuarios = db.collection('usuarios');
        const { id } = req.params;
        const result = await usuarios.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json({ message: 'Usuário removido com sucesso' });
    } catch (err) {
        res.status(500).json({ "error": `${err.message}` });
    }
});

export default router;
