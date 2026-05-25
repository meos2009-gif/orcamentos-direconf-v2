import { useEffect, useState } from "react";
import { getVariaveis, guardarVariavel, apagarVariavel } from "../state/variaveis";

export default function ConfigurarVariaveis() {
  const [variaveis, setVariaveis] = useState([]);
  const [novaVariavel, setNovaVariavel] = useState("");

  async function carregar() {
    const lista = await getVariaveis();
    setVariaveis(lista);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function adicionar() {
    if (!novaVariavel.trim()) return;

    await guardarVariavel(novaVariavel.trim());
    setNovaVariavel("");
    carregar();
  }

  async function apagar(id) {
    if (!confirm("Apagar esta variável?")) return;
    await apagarVariavel(id);
    carregar();
  }

  return (
    <div className="card-premium">
      <h2 className="titulo-premium">Configurar Variáveis</h2>

      {/* ADICIONAR VARIÁVEL */}
      <div className="form-card" style={{ marginBottom: "20px" }}>
        <label>Nova variável</label>
        <input
          className="input-premium"
          value={novaVariavel}
          onChange={(e) => setNovaVariavel(e.target.value)}
          placeholder="Ex: Tingimento, Bordado, Estampado..."
        />

        <button className="btn-acao" onClick={adicionar} style={{ marginTop: "10px" }}>
          Adicionar
        </button>
      </div>

      {/* LISTA DE VARIÁVEIS */}
      <div className="form-card">
        <h3>Variáveis existentes</h3>

        {variaveis.length === 0 && (
          <p className="texto-vazio">Nenhuma variável configurada.</p>
        )}

        {variaveis.length > 0 && (
          <table className="tabela-premium">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {variaveis.map((v) => (
                <tr key={v.id}>
                  <td>{v.nome}</td>

                  <td>
                    <button
                      className="btn-apagar"
                      onClick={() => apagar(v.id)}
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
