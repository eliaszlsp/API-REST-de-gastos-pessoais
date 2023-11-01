import axios from "axios";

const urlPadrao = "http://localhost:3000";

export const cadastroELogin = axios.create({
  baseURL: `${urlPadrao}`,
});
