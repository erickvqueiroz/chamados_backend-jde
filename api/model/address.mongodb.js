// Conectar ao banco de dados 'address'
use('address');

// Inserir um exemplo de usuário
db.usuarios.insertOne({
    "fullName": "Ana Laura Domingues",
    "cpf": "123.456.789-09",
    "age": 29,
    "phone": "(11) 98765-4321",
    "address": "Rua das Flores, 123, São Paulo, SP",
    "email": "ana.domingues@example.com",
    "password": "hashed_password_example", // Você deve hash a senha em uma aplicação real
    "dataCriacao": new Date('2024-10-15')
});

// Criar índices para CPF e e-mail serem únicos
db.usuarios.createIndex({ cpf: 1 }, { unique: true });
db.usuarios.createIndex({ email: 1 }, { unique: true });

// Consulta: Equivalente ao SELECT * FROM usuarios
db.usuarios.find();

// Consulta: Selecionar apenas o nome, CPF e e-mail de todos os usuários
db.usuarios.find({}, {fullName: 1, cpf: 1, email: 1, _id: 0});

// Inserir mais exemplos de usuários
db.usuarios.insertMany([
    {
        "fullName": "Carlos Souza",
        "cpf": "987.654.321-00",
        "age": 34,
        "phone": "(21) 91234-5678",
        "address": "Avenida Central, 456, Rio de Janeiro, RJ",
        "email": "carlos.souza@example.com",
        "password": "hashed_password_example",
        "dataCriacao": new Date('2024-10-12')
    },
    {
        "fullName": "Bruno Costa",
        "cpf": "321.654.987-11",
        "age": 28,
        "phone": "(31) 99876-5432",
        "address": "Rua dos Mineiros, 789, Belo Horizonte, MG",
        "email": "bruno.costa@example.com",
        "password": "hashed_password_example",
        "dataCriacao": new Date('2024-10-14')
    }
]);

// Consulta: Selecionar nome, e-mail e idade dos usuários com mais de 30 anos
db.usuarios.find({"age": {$gt: 30}}, {fullName: 1, email: 1, age: 1, _id: 0});

// Consulta: Selecionar usuários por cidade no endereço
db.usuarios.find({"address": {$regex: "São Paulo"}}, {fullName: 1, address: 1, _id: 0});

// Atualizar o endereço de um usuário específico
db.usuarios.updateOne({cpf: "123.456.789-09"}, {$set: {address: "Rua Nova, 456, São Paulo, SP"}});

// Deletar um usuário específico pelo CPF
db.usuarios.deleteOne({cpf: "321.654.987-11"});

// Consulta: Selecionar todos os usuários
db.usuarios.find();
