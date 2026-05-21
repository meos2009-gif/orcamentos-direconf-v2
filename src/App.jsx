import { Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import FormularioPreco from "./pages/FormularioPreco";
import ConfigurarVariaveis from "./pages/ConfigurarVariaveis";
import Clientes from "./pages/Clientes";
import Login from "./pages/Login";
import RotaProtegida from "./components/RotaProtegida";

import ListaFichas from "./pages/ListaFichas";
import FichaCliente from "./pages/FichaCliente";

export default function App() {
  const location = useLocation();
  const esconderSidebar = location.pathname === "/login";

  return (
    <div className="app-layout">
      {!esconderSidebar && <Sidebar />}

      <div className="app-content">
        <Routes>

  <Route path="/login" element={<Login />} />

  {/* FORMULÁRIO PRINCIPAL */}
  <Route
    path="/"
    element={
      <RotaProtegida>
        <FormularioPreco />
      </RotaProtegida>
    }
  />

  {/* FORMULÁRIO COM PARAMETROS (EDITAR / DUPLICAR) */}
  <Route
    path="/formulario"
    element={
      <RotaProtegida>
        <FormularioPreco />
      </RotaProtegida>
    }
  />

  <Route
    path="/configurar"
    element={
      <RotaProtegida>
        <ConfigurarVariaveis />
      </RotaProtegida>
    }
  />

  <Route
    path="/clientes"
    element={
      <RotaProtegida>
        <Clientes />
      </RotaProtegida>
    }
  />

  <Route
    path="/fichas"
    element={
      <RotaProtegida>
        <ListaFichas />
      </RotaProtegida>
    }
  />

  <Route
    path="/cliente/:cliente"
    element={
      <RotaProtegida>
        <FichaCliente />
      </RotaProtegida>
    }
  />

</Routes>

      </div>
    </div>
  );
}
