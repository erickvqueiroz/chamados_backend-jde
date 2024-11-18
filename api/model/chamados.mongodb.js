// Conectar ao banco de dados 'ferramentasChamados'
use('ferramentasChamados');

// Inserir um exemplo de chamado
db.chamados.insertOne({
    "titulo": "Erro de conexão",
    "descricao": "Usuário não consegue se conectar ao sistema",
    "prioridade": 1,
    "valorEstimado": 250.50,
    "dataCriacao": new Date('2024-10-15'),
    "status": "Aberto",
    "responsavel": "Ana Laura Domingues",
    "categoria": "Rede",
    "avaliacao": "⭐⭐⭐⭐"
});

// Criar um índice para não permitir títulos duplicados
db.chamados.createIndex({ titulo: 1 }, { unique: true });

// Consulta: Equivalente ao SELECT * FROM chamados
db.chamados.find();

// Consulta: Selecionar apenas o título, prioridade e status de todos os chamados
db.chamados.find({}, {titulo: 1, prioridade: 1, status: 1, _id: 0});

// Inserir mais exemplos de chamados
db.chamados.insertMany([
    {
        "titulo": "Falha no servidor",
        "descricao": "Servidor parou de responder após a última atualização",
        "prioridade": 2,
        "valorEstimado": 500.00,
        "dataCriacao": new Date('2024-10-12'),
        "status": "Em andamento",
        "responsavel": "Carlos Souza",
        "categoria": "Infraestrutura",
        "avaliacao": "⭐⭐⭐⭐"
    },
    {
        "titulo": "Erro no login",
        "descricao": "Usuário não consegue logar com as credenciais corretas",
        "prioridade": 3,
        "valorEstimado": 150.00,
        "dataCriacao": new Date('2024-10-14'),
        "status": "Aberto",
        "responsavel": "Bruno Costa",
        "categoria": "Sistema",
        "avaliacao": "⭐⭐⭐"
    }
]);

// Consulta: Selecionar título, responsável e status de chamados abertos
db.chamados.find({"status": {$eq: "Aberto"}}, {titulo: 1, responsavel: 1, status: 1, _id: 0});

// Consulta: Selecionar chamados com valor estimado menor ou igual a 300
db.chamados.find({"valorEstimado": {$lte: 300}}, {titulo: 1, valorEstimado: 1, _id: 0});

// Atualizar o valor estimado de um chamado específico
db.chamados.updateOne({titulo: "Erro no login"}, {$set: {valorEstimado: 200.00}});

// Deletar um chamado específico
db.chamados.deleteOne({titulo: "Erro de conexão"});

// Inserir uma nova collection de categorias
use('ferramentasChamados');
db.categorias.insertMany([
    { nome: "Infraestrutura" },
    { nome: "Rede" },
    { nome: "Sistema" },
    { nome: "Hardware" }
]);

// Consulta: Selecionar todas as categorias
db.categorias.find();
