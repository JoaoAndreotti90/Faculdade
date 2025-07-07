// DEPENDÊNCIAS
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// INICIAR EXPRESS
const app = express();
const PORT = 3000;

// MIDDLEWARES
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // rota para acessar imagens

// CONEXÃO COM MYSQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'prova',
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('✅ Conectado ao MySQL');
});

// MULTER (UPLOAD DE IMAGENS)
// Garante que o diretório 'uploads' exista
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // Extrai a extensão original e adiciona um timestamp para evitar conflitos
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
});

// MIDDLEWARE PARA VERIFICAR TOKEN JWT
const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ erro: 'Token não fornecido ou mal formatado' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, 'seuSegredoSuperSecreto', (err, decoded) => {
    if (err) return res.status(403).json({ erro: 'Token inválido ou expirado' });
    req.usuario = decoded; // Adiciona payload decodificado (ex: { id: usuario.id }) à requisição
    next();
  });
};

// ========== ROTAS ==========

// ------------------- AUTENTICAÇÃO -------------------

// LOGIN (Não requer token)
app.post('/login', (req, res) => {
  const { login, senha } = req.body;
  if (!login || !senha) return res.status(400).json({ erro: 'Login e senha obrigatórios' });

  connection.query('SELECT * FROM usuarios WHERE login = ?', [login], async (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro interno ao buscar usuário' });
    if (results.length === 0) return res.status(401).json({ erro: 'Credenciais inválidas' });

    const usuario = results[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(401).json({ erro: 'Credenciais inválidas' });

    // Gera o token JWT
    const token = jwt.sign({ id: usuario.id, login: usuario.login }, 'seuSegredoSuperSecreto', { expiresIn: '1h' });

    // Remove a senha antes de enviar a resposta
    const { senha: _, ...usuarioSemSenha } = usuario;
    res.json({ mensagem: 'Login realizado com sucesso', usuario: usuarioSemSenha, token });
  });
});

// ------------------- CRUD USUÁRIOS -------------------
// Todas as rotas de usuários abaixo requerem token

// POST - Cadastrar novo usuário (Aberto inicialmente, mas pode requerer token dependendo da lógica de negócio)
// Instrução não especifica se cadastro inicial precisa de token, vamos manter aberto por enquanto.
app.post('/usuarios', async (req, res) => {
  const { login, senha } = req.body;
  if (!login || !senha) return res.status(400).json({ erro: 'Login e senha obrigatórios' });

  try {
    const hash = await bcrypt.hash(senha, 10);
    connection.query(
      'INSERT INTO usuarios (login, senha) VALUES (?, ?)',
      [login, hash],
      (err, results) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ erro: 'Login já em uso' }); // 409 Conflict é mais apropriado
          }
          console.error('Erro DB:', err);
          return res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
        }
        res.status(201).json({ id: results.insertId, login: login });
      }
    );
  } catch (error) {
    console.error('Erro Hash:', error);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// GET - Listar todos os usuários (Requer token)
app.get('/usuarios', verificarToken, (req, res) => {
  connection.query('SELECT id, login FROM usuarios', (err, results) => {
    if (err) {
      console.error('Erro DB:', err);
      return res.status(500).json({ erro: 'Erro ao listar usuários' });
    }
    res.json(results);
  });
});

// PUT - Atualizar usuário (Requer token)
app.put('/usuarios/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const { login, senha } = req.body;

  // Verifica se o ID do token corresponde ao ID do usuário sendo atualizado (ou se é admin, se aplicável)
  // Neste caso simples, vamos permitir que qualquer usuário autenticado atualize qualquer outro, mas idealmente haveria mais validação.
  // if (req.usuario.id !== parseInt(id)) {
  //   return res.status(403).json({ erro: 'Permissão negada para atualizar este usuário' });
  // }

  if (!login && !senha) {
    return res.status(400).json({ erro: 'Pelo menos um campo (login ou senha) deve ser fornecido para atualização' });
  }

  let query = 'UPDATE usuarios SET ';
  const params = [];

  if (login) {
    query += 'login = ?';
    params.push(login);
  }

  if (senha) {
    try {
      const hash = await bcrypt.hash(senha, 10);
      if (login) query += ', ';
      query += 'senha = ?';
      params.push(hash);
    } catch (error) {
      console.error('Erro Hash:', error);
      return res.status(500).json({ erro: 'Erro interno ao processar senha' });
    }
  }

  query += ' WHERE id = ?';
  params.push(id);

  connection.query(query, params, (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ erro: 'Login já em uso por outro usuário' });
      }
      console.error('Erro DB:', err);
      return res.status(500).json({ erro: 'Erro ao atualizar usuário' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    res.json({ mensagem: 'Usuário atualizado com sucesso' });
  });
});

// DELETE - Excluir usuário (Requer token)
app.delete('/usuarios/:id', verificarToken, (req, res) => {
  const { id } = req.params;

  // Similar ao PUT, idealmente verificar permissões
  // if (req.usuario.id !== parseInt(id)) { ... }

  connection.query('DELETE FROM usuarios WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro DB:', err);
      return res.status(500).json({ erro: 'Erro ao excluir usuário' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    res.json({ mensagem: 'Usuário excluído com sucesso' });
  });
});

// ------------------- CRUD CLIENTES -------------------
// Todas as rotas de clientes requerem token

// POST - Cadastrar novo cliente (Requer token)
app.post('/clientes', verificarToken, upload.single('foto'), (req, res) => {
  const { nome, email, telefone, endereco, latitude, longitude } = req.body;
  if (!nome || !email || !endereco || !latitude || !longitude) {
    // Se uma foto foi enviada mas faltam dados, remove o arquivo temporário
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ erro: 'Dados obrigatórios ausentes (nome, email, endereco, latitude, longitude)' });
  }

  let fotoPath = null;
  if (req.file) {
    // Salva o caminho relativo acessível pela rota estática /uploads
    fotoPath = `/uploads/${req.file.filename}`;
  }

  // Instrução pede para armazenar localização e foto (caminho OU blob)
  // Optamos por armazenar apenas o caminho (foto_fachada_caminho) e não o blob.
  // Se fosse necessário o blob, leríamos o arquivo com fs.readFileSync(req.file.path)
  // e ajustaríamos o SQL e os parâmetros.
  const sql = `INSERT INTO clientes (nome, email, telefone, endereco, latitude, longitude, foto_fachada_caminho) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  connection.query(sql, [nome, email, telefone, endereco, latitude, longitude, fotoPath], (err, result) => {
    // Se der erro no DB mas a foto foi enviada, remove o arquivo
    if (err && req.file) fs.unlinkSync(req.file.path);

    if (err) {
        console.error('Erro DB:', err);
        return res.status(500).json({ erro: 'Erro ao cadastrar cliente' });
    }
    res.status(201).json({ id: result.insertId, nome: nome, foto_fachada_caminho: fotoPath });
  });
});

// GET - Listar todos os clientes (Requer token)
app.get('/clientes', verificarToken, (req, res) => {
  // Seleciona todos os campos relevantes, incluindo o caminho da foto
  const sql = `SELECT id, nome, email, telefone, endereco, latitude, longitude, foto_fachada_caminho, data_cadastro FROM clientes`;
  connection.query(sql, (err, results) => {
    if (err) {
        console.error('Erro DB:', err);
        return res.status(500).json({ erro: 'Erro ao buscar clientes' });
    }
    res.json(results);
  });
});

// GET - Buscar cliente por ID (Requer token)
app.get('/clientes/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const sql = `SELECT id, nome, email, telefone, endereco, latitude, longitude, foto_fachada_caminho, data_cadastro FROM clientes WHERE id = ?`;
  connection.query(sql, [id], (err, results) => {
    if (err) {
        console.error('Erro DB:', err);
        return res.status(500).json({ erro: 'Erro ao buscar cliente' });
    }
    if (results.length === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }
    res.json(results[0]); // Retorna o primeiro (e único) resultado
  });
});

// PUT - Atualizar cliente por ID (Requer token)
app.put('/clientes/:id', verificarToken, upload.single('foto'), (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, endereco, latitude, longitude } = req.body;

  // Busca o cliente atual para obter o caminho da foto antiga, se houver
  connection.query('SELECT foto_fachada_caminho FROM clientes WHERE id = ?', [id], (err, results) => {
    if (err) {
      if (req.file) fs.unlinkSync(req.file.path); // Remove a nova foto se houver erro no select
      return res.status(500).json({ erro: 'Erro ao buscar cliente para atualização' });
    }
    if (results.length === 0) {
      if (req.file) fs.unlinkSync(req.file.path); // Remove a nova foto se cliente não existe
      return res.status(404).json({ erro: 'Cliente não encontrado para atualização' });
    }

    const clienteAtual = results[0];
    let fotoPath = clienteAtual.foto_fachada_caminho; // Mantém a foto antiga por padrão
    let fotoAntigaPath = clienteAtual.foto_fachada_caminho;

    // Se uma nova foto foi enviada, atualiza o caminho e marca a antiga para exclusão (se existir)
    if (req.file) {
      fotoPath = `/uploads/${req.file.filename}`;
    } else {
      // Se não enviou foto nova, mas quer remover a existente (ex: um campo 'remover_foto' = true no body)
      // Aqui vamos assumir que se não enviar foto, mantém a antiga. Para remover, seria necessário lógica adicional.
    }

    // Monta a query SQL dinamicamente apenas com os campos fornecidos
    // (Embora neste caso, a prova parece esperar todos os campos)
    // Vamos manter a lógica de atualizar todos os campos conforme o código original, mas usando o novo fotoPath
    const sql = `
      UPDATE clientes SET
      nome = ?, email = ?, telefone = ?, endereco = ?, latitude = ?, longitude = ?, foto_fachada_caminho = ?
      WHERE id = ?
    `;
    const params = [nome, email, telefone, endereco, latitude, longitude, fotoPath, id];

    connection.query(sql, params, (err, updateResult) => {
      // Se der erro no update
      if (err) {
        // Se enviou foto nova, remove-a
        if (req.file) fs.unlinkSync(req.file.path);
        console.error('Erro DB:', err);
        return res.status(500).json({ erro: 'Erro ao atualizar cliente' });
      }

      // Se o update foi bem sucedido e uma nova foto foi enviada E existia uma foto antiga diferente da nova
      if (updateResult.affectedRows > 0 && req.file && fotoAntigaPath && fotoAntigaPath !== fotoPath) {
        // Tenta remover a foto antiga do sistema de arquivos
        const fullPathAntiga = path.join(__dirname, fotoAntigaPath);
        if (fs.existsSync(fullPathAntiga)) {
          fs.unlink(fullPathAntiga, (unlinkErr) => {
            if (unlinkErr) console.error('Erro ao remover foto antiga:', unlinkErr);
          });
        }
      }

      if (updateResult.affectedRows === 0) {
         // Isso não deveria acontecer por causa da verificação anterior, mas por segurança:
         if (req.file) fs.unlinkSync(req.file.path);
         return res.status(404).json({ erro: 'Cliente não encontrado (pós-verificação)' });
      }

      res.json({ mensagem: 'Cliente atualizado com sucesso' });
    });
  });
});

// DELETE - Excluir cliente por ID (Requer token)
app.delete('/clientes/:id', verificarToken, (req, res) => {
  const { id } = req.params;

  // 1. Buscar o cliente para pegar o caminho da foto e excluí-la do disco
  connection.query('SELECT foto_fachada_caminho FROM clientes WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar cliente para exclusão' });
    }
    // Não bloqueia se não encontrar, apenas não haverá foto para excluir
    const fotoPath = results.length > 0 ? results[0].foto_fachada_caminho : null;

    // 2. Excluir o registro do banco de dados
    connection.query('DELETE FROM clientes WHERE id = ?', [id], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error('Erro DB:', deleteErr);
        return res.status(500).json({ erro: 'Erro ao excluir cliente do banco de dados' });
      }

      if (deleteResult.affectedRows === 0) {
        return res.status(404).json({ erro: 'Cliente não encontrado para exclusão' });
      }

      // 3. Se o registro foi excluído e havia um caminho de foto, tenta excluir o arquivo
      if (fotoPath) {
        const fullPath = path.join(__dirname, fotoPath);
        if (fs.existsSync(fullPath)) {
          fs.unlink(fullPath, (unlinkErr) => {
            if (unlinkErr) {
              // Loga o erro mas não retorna erro ao cliente, pois o registro do DB foi removido
              console.error('Erro ao remover arquivo de foto associado:', unlinkErr);
            }
          });
        }
      }

      res.json({ mensagem: 'Cliente excluído com sucesso' });
    });
  });
});

// =================== INICIAR SERVIDOR ===================
app.listen(PORT, '0.0.0.0', () => { // Escutar em 0.0.0.0 para permitir acesso externo se necessário
  console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
});

