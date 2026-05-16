import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Gestor from "./pages/Gestor";
import Aluno from "./pages/Aluno";

// define as rotas da aplicacao
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gestor" element={<Gestor />} />
        <Route path="/aluno" element={<Aluno />} />
      </Routes>
    </BrowserRouter>
  );
}
