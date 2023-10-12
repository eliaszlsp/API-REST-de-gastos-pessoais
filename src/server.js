const express = require("express");
const rotas = require("./routers");

const app = express();
const port = 3000;
app.use(express.json());
app.use(rotas);
app.listen(port);
