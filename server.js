const express = require('express');
const sql = require('mssql');
const app = express();
const port = 3000;

// Configurações do banco de dados
const config = {
  user: '<senhor_H>',
  password: '<12345678>',
  server: 'localhost',
  database: '</Projet Syscon.laccdb>.mdb',
  driver: 'msnodesqlv8',
};

// Config do ejs como template engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Rota raiz
app.get('/', async (req, res) => { 
  try {
    // Conecta ao banco de dados
    await sql.connect(config);

    // Recupera os clientes cadastrados
    const result = await sql.query('SELECT * FROM clientes');
    const clientes = result.recordset;

     res.render('index', { clientes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao recuperar os clientes: ${error.message}');
  }
});

// Rota para cadastrar um novo cliente
app.post('/clientes', async (req, res) => {
  const { nome, bairro, telefone, endereco, cidade, numero_casa } = req.body;

  try {
    // Conecta ao banco de dados
    await sql.connect(config);

    // Insere o novo cliente na tabela
    await sql.query(`INSERT INTO clientes (nome, bairro, telefone, endereco, cidade, numero_casa) VALUES ('${nome}', '${bairro}', '${telefone}', '${endereco}', '${cidade}', '${numero_casa}')`);

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao cadastrar o cliente.');
  }
});

// Rota para excluir um cliente
app.post('/clientes/excluir/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Conecta ao banco de dados
    await sql.connect(config);

    // Exclui o cliente da tabela
    await sql.query(`DELETE FROM clientes WHERE id=${id}`);

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao excluir o cliente.');
  }
});


// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
