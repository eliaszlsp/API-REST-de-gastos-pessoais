import Cookies from "js-cookie";

export const salvarCookie = (name, data) => {
  Cookies.set(name, data);
};

export const pegarCookie = (name) => {
  return Cookies.get(name);
};

export const excluirCookie = (name) => {
  Cookies.remove(name);
};
