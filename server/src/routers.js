const express = require("express");
const rotas = express();

const { autenticacao } = require("./middleware/middleware");
const {
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
} = require("./controllers/controllers");

rotas.post("/usuario", cadastrarUsuario);

rotas.post("/login", logarUsuario);

rotas.use(autenticacao);

rotas.get("/usuario", detalharUsuario);

rotas.put("/usuario", atualizarUsuario);

rotas.get("/categoria", listarCategorias);

rotas.get("/transacao", listarTransacoes);

rotas.get("/transacao/extrato", criandoExtrato);

rotas.get("/transacao/:id", detalharTransacao);

rotas.post("/transacao", cadastrarTransacao);

rotas.put("/transacao/:id", atualizartransacao);

rotas.delete("/transacao/:id", deletarTransacao);

module.exports = rotas;
