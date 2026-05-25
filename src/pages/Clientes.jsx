import { useEffect, useState } from "react";
import { listarClientes, guardarCliente, apagarCliente } from "../state/clientes";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [novoCliente, setNovoCliente] = useState("");

  async function carregar() {
    const { data } = await listarClientes();
    setClientes(data || []);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function adicionar() {
    if (!novoCliente.trim()) return;

    await guardarCliente(novoCliente.trim());
    setNovoCliente("");
    carregar();
  }

  async function apagar(id) {
    if (!confirm("Apagar este cliente?")) return;
    await apagarCliente(id);
    carregar();
  }

  return (
    <div className="card-premium">
      <h2 className="titulo-premium">Clientes</h2>

      {/* ADICIONAR CLIENTE */}
      <div className="form-card" style={{ marginBottom: "20px" }}>
        <label>Novo cliente</label>
        <input
          className="input-premium"
          value={novoCliente}
          onChange={(e) => setNovoCliente(e.target.value)}
          placeholder="Nome do cliente..."
        />

        <button className="btn-acao" onClick={adicionar} style={{ marginTop: "10px" }}>
          Adicionar
        </button>
      </div>

      {/* LISTA DE CLIENTES */}
      <div className="form-card">
        <h3>Clientes registados</h3>

        {clientes.length === 0 && (
          <p className="texto-vazio">Nenhum cliente registado.</p>
        )}

        {clientes.length > 0 && (
          <table className="tabela-premium">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {clientes.map((c) => (
                <tr key={c.id}>
                  <td>{c.nome}</td>

                  <td>
                    <button
                      className="btn-apagar"
                      onClick={() => apagar(c.id)}
                    >
                      Apagar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
