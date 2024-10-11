const express = require('express');
const fs = require('fs');
const Joi = require('joi');
const app = express();
const PORT = 3000;

app.use(express.json());

const filePath = './data.json';
let products = [];

// Lê os dados do arquivo JSON ao iniciar
try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    products = JSON.parse(fileData);
} catch (error) {
    console.error('Erro ao ler o arquivo:', error);
    products = []; // Inicializa como array vazio se houver erro
}

// Salva os dados no arquivo JSON
function saveDataToFile() {
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf8');
}

// Middleware de validação de dados
const productSchema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(5).required(),
    quantity: Joi.number().integer().min(0).required()
});

function validateProduct(req, res, next) {
    const { error } = productSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

// Endpoint para adicionar um produto
app.post('/products', validateProduct, (req, res) => {
    const { title, description, quantity } = req.body;
    const newProduct = { id: products.length + 1, title, description, quantity };
    products.push(newProduct);
    saveDataToFile();
    res.status(201).json(newProduct);
});

// Endpoint para listar todos os produtos
app.get('/products', (req, res) => {
    res.json(products);
});

// Endpoint para buscar um produto pelo ID
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json(product);
});

// Endpoint para atualizar um produto
app.put('/products/:id', validateProduct, (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });

    product.title = req.body.title || product.title;
    product.description = req.body.description || product.description;
    product.quantity = req.body.quantity || product.quantity;
    saveDataToFile();

    res.json(product);
});

// Endpoint para deletar um produto
app.delete('/products/:id', (req, res) => {
    products = products.filter(p => p.id !== parseInt(req.params.id));
    saveDataToFile();
    res.status(204).send();
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
