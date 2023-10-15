const express = require("express");
const rotas = require("./routers");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(rotas);
app.listen(port);
