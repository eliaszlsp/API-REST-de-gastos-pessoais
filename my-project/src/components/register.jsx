// Cadastro.js
import { useState } from "react";
import { cadastroELogin } from "../utils/api";

export default function Register() {
  const [formValues, setFormValues] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      console.log("oi 1");

      const { response } = await cadastroELogin.post("/usuario", formValues);

      console.log(response.data, "oi 2");
    } catch (error) {
      alert(error.response.data.mensagem);
    }
  };

  return (
    <section className="flex justify-center items-center h-screen bg-gray-800">
      <div className="max-w-md w-full bg-gray-900 rounded p-6 space-y-4">
        <div className="mb-4">
          <p className="text-gray-400">Cadastro</p>
          <h2 className="text-xl font-bold text-white">Crie sua conta</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <input
              name="nome"
              className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
              type="text"
              placeholder="Nome"
              value={formValues.nome}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              name="email"
              className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
              type="text"
              placeholder="Email"
              value={formValues.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              name="senha"
              className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
              type="password"
              placeholder="Senha"
              value={formValues.senha}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              name="confirmarSenha"
              className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
              type="password"
              placeholder="Confirmar Senha"
              value={formValues.confirmarSenha}
            />
          </div>
          <div>
            <button
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold text-gray-50 transition duration-200"
              type="submit"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
