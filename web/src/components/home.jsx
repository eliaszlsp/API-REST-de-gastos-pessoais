import axios from "axios";
import logo from "../assets/hand.png";
import { pegarCookie } from "../utils/token";
import { useState } from "react";

export default function Home() {
  const [usuario, setUsuario] = useState("");

  const token = pegarCookie("authorization");
  const enviandoToken = async (nomeRota) => {
    const { data } = await axios.get(`http://localhost:3000/${nomeRota}`, {
      headers: {
        authorization: token,
      },
    });

    return await data;
  };
  enviandoToken();

  return (
    <>
      <div className=" flex w-full gap-32 justify-center pt-9 items-center   bg-gray-800 flex-col">
        <header className=" flex flex-row  justify-between  w-[1120px]">
          <div className=" flex flex-row text-white h-1/4    items-center">
            <img src={logo} alt="" className=" w-4 h-4  " />
            <span>EGestão</span>
          </div>
          <div className="flex flex-row text-white h-1/4    items-center">
            <img src={logo} alt="" className=" w-4 h-4  " />
            <p> perfil</p>
          </div>
        </header>
        <h1></h1>
        <main className=" flex  flex-col h-screen w-[1120px] ">
          <section className=" flex  flex-col   gap-40 ">
            <div className=" flex flex-row justify-between items-center ">
              <p>Dashboard</p>
              <button className=" w-[100px] h-7  bg-blue-600">Deposito</button>
            </div>
            <div className=" flex flex-row justify-between items-center">
              <p> despesas </p>
              <select name="" id="">
                <option value=""> esse mês</option>
              </select>
            </div>
            <div className=" flex flex-row  justify-between">
              <div>
                <p>entrada</p>
                <span>4500</span>
              </div>
              <div>
                <p>saida</p>
                <span>400</span>
              </div>{" "}
              <div>
                <p>gastos</p>
                <span>700</span>
              </div>
            </div>
          </section>
          <section>
            <table className="w-full border border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="py-2 px-4">descrição</th>
                  <th className="py-2 px-4">valor</th>
                  <th className="py-2 px-4">data</th>
                  <th className="py-2 px-4">categoria</th>
                  <th className="py-2 px-4">saida</th>
                </tr>
              </thead>
              <tbody className="text-center">
                <tr className="bg-gray-100 hover:bg-gray-200">
                  <td className="py-2 px-4">1asdasda</td>
                  <td className="py-2 px-4">2adsadas</td>
                  <td className="py-2 px-4">3asdadsa</td>
                  <td className="py-2 px-4">4asdasdsa</td>
                  <td className="py-2 px-4">5asdsa</td>
                </tr>
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </>
  );
}
