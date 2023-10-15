import { Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Home from "./components/home";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}
