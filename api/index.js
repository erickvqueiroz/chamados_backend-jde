import express from 'express';
import rotasChamados from './routes/chamados.js';
import rotasAddress from './routes/address.js';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Removendo o 'x-powered-by' por segurança
app.disable('x-powered-by');

// Rota de conteúdo público
app.use('/', express.static('public'));

// Configurando o favicon
app.use('/favicon.ico', express.static('public/images/backend.png'));

// Rota para verificar o estado da API
app.get('/api', (req, res) => {
    res.status(200).json({
        message: 'API de Chamados 🚀⭐',
        version: '1.0.0'
    });
});

/* Rotas da aplicação */
app.use('/api/chamados', rotasChamados);
app.use('/api/address', rotasAddress);

// Tratando rotas inexistentes no backend
app.use((req, res, next) => {
    const rotaInvalida = req.originalUrl;
    res.status(404).json({
        message: `Rota ${rotaInvalida} não encontrada`,
        error: 'Invalid Route'
    });
});

// Inicializando o servidor
app.listen(PORT, () => {
    console.log(`Servidor Web rodando na porta ${PORT}`);
});
