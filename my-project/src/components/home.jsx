import logo from "../assets/logo.jpeg";
export default function Home() {
  return (
    <>
      <header className="  w-screen bg-gray-800   min-h-[40px] text-white flex  justify-center  items-center   ">
        <div className="    to-gray-800     flex flex-row h-full  w-[1280px]  justify-between">
          <img src={logo} width={40} height={40} alt="" />
          <nav className="  relative flex flex-row   justify-evenly items-center gap-10 ">
            <a className=" w-20 text-white   " href="Transacoes">
              Transaçoes
            </a>
            <a className=" w-20 text-center " href="Perfil">
              Perfil
            </a>
            <div className="absolute w-20 top-9 left-0  rounded-sm flex flex-col items-start justify-center  bg-gray-800 min-h-10">
              <a href="">teste</a>
              <a href="">test 2</a>
            </div>
            <div className="absolute w-20 top-9 right-0   rounded-sm flex flex-col items-start justify-center  bg-gray-800 min-h-10">
              <a href="">teste</a>
              <a href="">test 2</a>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
