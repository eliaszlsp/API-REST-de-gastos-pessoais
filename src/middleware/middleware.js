const jwt = require("jsonwebtoken");
const senhasegura = require("../senhasegura");

let idToken;
const autenticacao = async (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      return res.status(401).json({
        mensagem:
          "Para acessar este recurso um token de autenticação válido deve ser enviado.",
      });
    }
    const token = authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, senhasegura);

    idToken = decodedToken["id"];

    next();
  } catch (error) {
    return res.status(401).json({
      mensagem:
        "Para acessar este recurso um token de autenticação válido deve ser enviado.",
    });
  }
};

module.exports = {
  autenticacao,
  getTokenUsuario: () => idToken,
};
