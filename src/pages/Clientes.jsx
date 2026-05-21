import { useEffect, useState } from "react";
import { criarCliente, listarClientes, apagarCliente } from "../state/clientes";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  // 🔹 Carregar clientes do utilizador autenticado
  async function carregar() {
    const { data, error } = await listarClientes();
    if (!error) setClientes(data || []);
  }

  useEffect(() => {
    carregar();
  }, []);

  // 🔹 Criar cliente
  async function guardar() {
    if (!nome.trim()) return;

    const { error } = await criarCliente({ nome, telefone, email });

    if (error) {
      alert("Erro ao criar cliente");
      return;
    }

    setNome("");
    setTelefone("");
    setEmail("");

    carregar();
  }

  // 🔹 Apagar cliente
  async function remover(id) {
    if (!confirm("Apagar cliente?")) return;

    const { error } = await apagarCliente(id);

    if (!error) carregar();
  }

  return (
    <div className="card">
      <h2>Clientes</h2>

      {/* Formulário criar cliente */}
      <div className="form-linha-top">
        <div className="campo">
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Telefone</label>
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="btn-primary" onClick={guardar}>
          Guardar Cliente
        </button>
      </div>

      <hr style={{ margin: "20px 0", borderColor: "#334155" }} />

      {/* Lista de clientes */}
      <h3>Lista de Clientes</h3>

      {clientes.length === 0 && <p>Nenhum cliente encontrado.</p>}

      <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
        {clientes.map((c) => (
          <li key={c.id} style={{ marginBottom: "8px" }}>
            <b>{c.nome}</b> — {c.telefone} — {c.email}
            <button
              style={{
                marginLeft: "10px",
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "4px 8px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => remover(c.id)}
            >
              Apagar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
