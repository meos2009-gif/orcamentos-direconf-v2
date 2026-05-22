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

          {/* LOGIN */}
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

          {/* CONFIGURAR VARIÁVEIS */}
          <Route
            path="/configurar"
            element={
              <RotaProtegida>
                <ConfigurarVariaveis />
              </RotaProtegida>
            }
          />

          {/* CLIENTES */}
          <Route
            path="/clientes"
            element={
              <RotaProtegida>
                <Clientes />
              </RotaProtegida>
            }
          />

          {/* LISTA DE FICHAS */}
          <Route
            path="/fichas"
            element={
              <RotaProtegida>
                <ListaFichas />
              </RotaProtegida>
            }
          />

          {/* VER FICHA POR ID (CORRIGIDO) */}
          <Route
            path="/cliente/:id"
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
