import { Link } from "react-router-dom";
import { listarClientesComFicha } from "../state/precos";
import { useEffect, useState } from "react";

export default function ListaClientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    async function carregar() {
      const lista = await listarClientesComFicha();
      setClientes(lista);
    }
    carregar();
  }, []);

  return (
    <div className="card">
      <h1>Clientes</h1>

      {clientes.length === 0 && (
        <p style={{ color: "#9ca3af" }}>
          Nenhum cliente com fichas guardadas.
        </p>
      )}

      {clientes.length > 0 && (
        <ul style={{ marginTop: 12 }}>
          {clientes.map((clienteId) => (
            <li key={clienteId} style={{ marginBottom: 8 }}>
              <Link
                to={`/cliente/${encodeURIComponent(clienteId)}`}
                style={{ color: "#93c5fd" }}
              >
                {clienteId}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
