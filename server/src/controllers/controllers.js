const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const senhasegura = require("../senhasegura");
const { getTokenUsuario } = require("../middleware/middleware");
const pool = require("../database/connection");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  const referenciaDeBody = {
    nome,
    email,
    senha,
  };
  try {
    const dadosPendentes = Object.keys(referenciaDeBody).filter((falta) => {
      return !referenciaDeBody[falta];
    });
    if (dadosPendentes.length > 0) {
      return res
        .status(400)
        .json({ mensagem: `Dados pendentes : ${dadosPendentes.join(",")}` });
    }

    const buscandoEmail = await pool.query(
      `select * from usuarios where email = $1`,
      [email]
    );

    if (buscandoEmail.rowCount > 0) {
      return res.status(400).json({ mensagem: "o  email informado já existe" });
    }

    const hash = await bcrypt.hash(senha, 10);

    const insercaoDeDados = await pool.query(
      ` INSERT INTO  usuarios (nome, email, senha) 
       values ($1,$2,$3) returning *
      `,
      [nome, email, hash]
    );
    delete insercaoDeDados.rows[0].senha;

    return res.status(201).json(insercaoDeDados.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "erro interno servidor " });
  }
};

const logarUsuario = async (req, res) => {
  const { email, senha } = req.body;

  const referenciaDeBody = {
    email,
    senha,
  };
  try {
    const dadosPendentes = Object.keys(referenciaDeBody).filter((falta) => {
      return !referenciaDeBody[falta];
    });
    if (dadosPendentes.length > 0) {
      return res
        .status(400)
        .json({ mensagem: `Dados pendentes : ${dadosPendentes.join(",")}` });
    }
    const buscandoPeloEmail = await pool.query(
      `select * from usuarios where email = $1`,
      [email]
    );

    if (buscandoPeloEmail.rowCount < 1) {
      return res
        .status(400)
        .json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }

    const validandoSenha = await bcrypt.compare(
      senha,
      buscandoPeloEmail.rows[0].senha
    );

    if (!validandoSenha) {
      return res
        .status(401)
        .json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }

    const token = jwt.sign(
      {
        id: buscandoPeloEmail.rows[0].id,
        nome: buscandoPeloEmail.rows[0].nome,
      },
      senhasegura,
      { expiresIn: "8h" }
    );

    const { senha: _, ...dadosDoUsuario } = buscandoPeloEmail.rows[0];
    return res.status(200).json({ dadosDoUsuario, token });
  } catch (error) {
    return res.status(500).json({ message: "erro interno servidor " });
  }
};

const detalharUsuario = async (req, res) => {
  const idDoUsuario = getTokenUsuario();
  try {
    const buscandoPeloID = await pool.query(
      `select * from usuarios where id = $1`,
      [idDoUsuario]
    );

    const { senha: _, ...dadosDoUsuario } = buscandoPeloID.rows[0];
    return res.status(200).json(dadosDoUsuario);
  } catch (error) {
    return res.status(500).json({ message: "erro interno servidor " });
  }
};

const atualizarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  const referenciaDeBody = {
    nome,
    email,
    senha,
  };
  try {
    const idDoUsuario = getTokenUsuario();
    const dadosPendentes = Object.keys(referenciaDeBody).filter((falta) => {
      return !referenciaDeBody[falta];
    });

    if (dadosPendentes.length > 0) {
      return res
        .status(400)
        .json({ mensagem: `Dados pendentes : ${dadosPendentes.join(",")}` });
    }

    const buscandoPeloEmail = await pool.query(
      `select * from usuarios where email = $1`,
      [email]
    );

    const duplicidadeEmail = buscandoPeloEmail.rows.find((duplicado) => {
      return duplicado.email === email && duplicado.id !== idDoUsuario;
    });

    if (duplicidadeEmail) {
      return res.status(400).json({
        mensagem:
          "O e-mail informado já está sendo utilizado por outro usuário.",
      });
    }

    const hash = await bcrypt.hash(senha, 10);
    const alterarandoDados = await pool.query(
      `UPDATE usuarios set nome = $1 , email = $2, senha = $3 where id = $4  `,
      [nome, email, hash, idDoUsuario]
    );

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: "erro interno servidor " });
  }
};

const listarCategorias = async (req, res) => {
  try {
    const buscandoCategorias = await pool.query(`select * from categorias`);

    return res.status(200).json(buscandoCategorias.rows);
  } catch (error) {
    return res.status(500).json({ message: "erro interno servidor " });
  }
};

const listarTransacoes = async (req, res) => {
  const idDoUsuario = getTokenUsuario();
  const objetoQuery = req.query;

  try {
    const transacoes = await pool.query(
      `SELECT  t.id, t.tipo, t.descricao ,t.valor ,t.* ,  c.descricao  as  categoria_nome   FROM transacoes t 
        JOIN categorias c ON t.categoria_id = c.id 
        WHERE t.usuario_id = $1;
          `,
      [idDoUsuario]
    );

    const arrayChaveObjeto = Object.keys(objetoQuery)[0];
    const arrayValorObjeto = Object.values(objetoQuery)[0];

    if (arrayChaveObjeto === "categoria_nome" && arrayValorObjeto.length > 0) {
      const filtroQuery = transacoes.rows.filter((categoria) => {
        return arrayValorObjeto.includes(categoria.categoria_nome);
      });

      if (filtroQuery.length === 0) {
        return res.status(404).json(filtroQuery);
      }

      return res.status(200).json(filtroQuery);
    }

    return res.status(200).json(transacoes.rows);
  } catch (error) {
    return res.status(500).json({ message: "erro interno servidor " });
  }
};

const criandoExtrato = async (req, res) => {
  const idDoUsuario = getTokenUsuario();
  try {
    const transacoes = await pool.query(
      `SELECT tipo ,valor ,id  FROM transacoes 
      WHERE usuario_id = $1;
        `,
      [idDoUsuario]
    );

    const extrato = {
      entrada: 0,
      saida: 0,
    };

    transacoes.rows.forEach((soma) => {
      if (soma.tipo === "entrada") {
        return (extrato.entrada += soma.valor);
      }
      if (soma.tipo === "saida") {
        return (extrato.saida += soma.valor);
      }
    });

    return res.status(200).json(extrato);
  } catch (error) {
    return res.status(500).json({ message: "erro interno servidor " });
  }
};

const detalharTransacao = async (req, res) => {
  const { id } = req.params;
  const idDoUsuario = getTokenUsuario();
  try {
    const transacoesPorId = await pool.query(
      `SELECT * FROM transacoes where usuario_id=$1 and id = $2 `,
      [idDoUsuario, id]
    );

    if (transacoesPorId.rowCount < 1) {
      return res.status(400).json({ mensagem: "Transação não encontrada." });
    }
    const categoriaPorId = await pool.query(
      `SELECT * FROM categorias where id=$1 `,
      [transacoesPorId.rows[0].categoria_id]
    );
    const objetoResposta = {
      id: transacoesPorId.rows[0].id,
      tipo: transacoesPorId.rows[0].tipo,
      ...transacoesPorId.rows[0],
      categoria_nome: categoriaPorId.rows[0].descricao,
    };
    return res.status(200).json(objetoResposta);
  } catch (error) {
    return res.status(500).json({ message: "erro interno servidor " });
  }
};

const cadastrarTransacao = async (req, res) => {
  const idDoUsuario = getTokenUsuario();
  const { tipo, descricao, valor, data, categoria_id } = req.body;
  const referenciaDeBody = { tipo, descricao, valor, data, categoria_id };
  const dadosPendentes = Object.keys(referenciaDeBody).filter((falta) => {
    return !referenciaDeBody[falta];
  });

  if (tipo !== "entrada" && tipo !== "saida") {
    return res.status(400).json({
      mensagem: `o tipo enviado não  é  entrada ou saida`,
    });
  }

  if (dadosPendentes.length > 0) {
    return res
      .status(400)
      .json({ mensagem: `Dados pendentes : ${dadosPendentes.join(",")}` });
  }
  try {
    const categoriaPorId = await pool.query(
      `SELECT * FROM categorias where id=$1 `,
      [categoria_id]
    );
    const cadastrarTransacao = await pool.query(
      ` INSERT INTO transacoes (tipo,descricao,valor,data,usuario_id,categoria_id)
        values($1,$2,$3,$4,$5,$6) returning *`,
      [tipo, descricao, valor, data, idDoUsuario, categoria_id]
    );
    const objetoResposta = {
      id: cadastrarTransacao.rows[0].id,
      tipo: cadastrarTransacao.rows[0].tipo,
      ...cadastrarTransacao.rows[0],
      categoria_nome: categoriaPorId.rows[0].descricao,
    };
    return res.status(200).json(objetoResposta);
  } catch (error) {
    return res.status(500).json({ message: "erro interno servidor " });
  }
};
const atualizartransacao = async (req, res) => {
  const { id, tipo, descricao, valor, data, categoria_id } = {
    ...req.params,
    ...req.body,
  };
  const referenciaDeBody = {
    tipo,
    descricao,
    valor,
    data,
    categoria_id,
  };
  const idDoUsuario = getTokenUsuario();
  const dadosPendentes = Object.keys(referenciaDeBody).filter((falta) => {
    return !referenciaDeBody[falta];
  });

  if (tipo !== "entrada" && tipo !== "saida") {
    return res.status(400).json({
      mensagem: `o tipo enviado não  é  entrada ou saida`,
    });
  }

  if (dadosPendentes.length > 0) {
    return res
      .status(400)
      .json({ mensagem: `Dados pendentes : ${dadosPendentes.join(",")}` });
  }
  try {
    const alterarandoDados = await pool.query(
      `UPDATE transacoes set tipo = $1 , descricao = $2, valor = $3 , data = $4 ,categoria_id = $5 where id = $6 and usuario_id = $7 returning*`,
      [tipo, descricao, valor, data, categoria_id, id, idDoUsuario]
    );
    if (alterarandoDados.rowCount < 1) {
      return res.status(400).json({ mensagem: "Transação não encontrada." });
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: "erro interno servidor " });
  }
};

const deletarTransacao = async (req, res) => {
  const { id } = req.params;
  const idDoUsuario = getTokenUsuario();

  try {
    const deletandoDados = await pool.query(
      `delete from transacoes where id = $1 and usuario_id = $2  
      returning * `,
      [id, idDoUsuario]
    );
    if (deletandoDados.rowCount < 1) {
      return res.status(404).json({ mensagem: "transação não encontrada" });
    }
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ message: "erro interno servidor" });
  }
};
module.exports = {
  cadastrarUsuario,
  logarUsuario,
  detalharUsuario,
  atualizarUsuario,
  listarCategorias,
  listarTransacoes,
  criandoExtrato,
  detalharTransacao,
  cadastrarTransacao,
  atualizartransacao,
  deletarTransacao,
};
