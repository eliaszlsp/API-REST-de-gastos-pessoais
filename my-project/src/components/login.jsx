import { useEffect, useState } from "react";
import axios from "axios";
import { salvarCookie } from "../utils/token";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [dados, setDados] = useState({});
  const navigate = useNavigate();
  useEffect(() => {}, [dados]);

  async function captureData(event) {
    event.preventDefault();

    const { email, password } = event.target;
    if (email.value && password.value) {
      const newDados = {
        ...dados,
        email: email.value,
        senha: password.value,
      };
      setDados(newDados);
      try {
        const { data } = await axios.post(
          "http://localhost:3000/login",
          newDados
        );
        salvarCookie("authorization", data.token);

        return navigate("/home");
      } catch (error) {
        alert(error.response.data.mensagem);
      }
    } else {
      alert("preencha o email e a senha");
    }
  }

  return (
    <section className="flex justify-center items-center h-screen bg-gray-800">
      <div className="max-w-md w-full bg-gray-900 rounded p-6 space-y-4">
        <div className="mb-4">
          <p className="text-gray-400">Sign In</p>
          <h2 className="text-xl font-bold text-white">Join our community</h2>
        </div>
        <form onSubmit={captureData} className="p-6 space-y-4">
          <div>
            <input
              name="email"
              className="w-full p-4 text-sm bg-gray-50 focus:outline-none border
               border-gray-200 rounded text-gray-600"
              type="text"
              placeholder="Email"
            />
          </div>
          <div>
            <input
              className="w-full p-4 text-sm bg-gray-50 focus:outline-none 
              border border-gray-200 rounded text-gray-600"
              type="text"
              name="password"
              placeholder="Password"
            />
          </div>
          <div>
            <button
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold
             text-gray-50 transition duration-200"
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center">
            <input
              type="checkbox"
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label
              htmlFor="comments"
              className="ml-2 text-sm font-normal text-gray-400"
            >
              Remember me
            </label>
          </div>
          <div>
            <a className="text-sm text-blue-600 hover:underline" href="#">
              Forgot password?
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
