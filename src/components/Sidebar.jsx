import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sb-premium">

      <h2 className="sb-logo">orcamentador</h2>

      <nav className="sb-nav">

        <NavLink to="/formulario" className="sb-item">
  Formulário de Preço
</NavLink>

        <NavLink to="/configurar" className="sb-item">
          Configurar Variáveis
        </NavLink>

        <NavLink to="/clientes" className="sb-item">
          Clientes
        </NavLink>

        <NavLink to="/fichas" className="sb-item">
          Fichas de Preço
        </NavLink>

      </nav>

      <NavLink to="/login" className="sb-item sb-sair">
        Sair
      </NavLink>

    </aside>
  );
}
