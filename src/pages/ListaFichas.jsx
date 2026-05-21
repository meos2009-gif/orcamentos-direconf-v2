import { useEffect, useState } from "react";
import { getTodasFichas, apagarFicha } from "../state/precos";
import { useNavigate } from "react-router-dom";

export default function ListaFichas() {
  const [fichas, setFichas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregar() {
      const lista = await getTodasFichas();
      setFichas(lista);
    }
    carregar();
  }, []);

  async function apagar(nomeCliente) {
    if (!confirm("Apagar ficha deste cliente?")) return;
    await apagarFicha(nomeCliente);
    const lista = await getTodasFichas();
    setFichas(lista);
  }

  return (
    <div className="card-premium">
      <h2 className="titulo-premium">Fichas de Preço</h2>

      {fichas.length === 0 && (
        <p className="texto-vazio">Nenhuma ficha guardada.</p>
      )}

      {fichas.length > 0 && (
        <table className="tabela-premium">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Referência</th>
              <th>Preço Final</th>
              <th>Preço Cliente</th>
              <th>Margem</th>
              <th>Comissão</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {fichas.map((f) => (
              <tr key={f.cliente}>
                <td>{f.cliente}</td>
                <td>{f.referencia}</td>

                <td>{f.precoComComissao.toFixed(2)} €</td>

                <td>{(f.precoCliente || 0).toFixed(2)} €</td>

                <td>{f.margem}%</td>
                <td>{f.comissao}%</td>

                <td>
                  <button
                    className="btn-acao"
                    onClick={() => navigate(`/formulario?cliente=${f.cliente}`)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-acao"
                    onClick={() => navigate(`/cliente/${f.cliente}`)}
                  >
                    Ver Ficha
                  </button>

                  <button
                    className="btn-acao"
                    onClick={() => navigate(`/formulario?duplicar=${f.cliente}`)}
                  >
                    Duplicar
                  </button>

                  <button
                    className="btn-apagar"
                    onClick={() => apagar(f.cliente)}
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
  );
}
