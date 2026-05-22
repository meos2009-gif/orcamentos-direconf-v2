import { useEffect, useState } from "react";
import { getTodasFichas, apagarFicha, duplicarFicha } from "../state/precos";
import { useNavigate } from "react-router-dom";

export default function ListaFichas() {
  const [fichas, setFichas] = useState([]);
  const navigate = useNavigate();

  async function carregar() {
    const lista = await getTodasFichas();
    setFichas(lista);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function apagarLinha(id) {
    if (!confirm("Apagar esta ficha?")) return;
    await apagarFicha(id);
    carregar();
  }

  async function duplicarLinha(id) {
    await duplicarFicha(id);
    carregar();
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
              <tr key={f.id}>
                <td>{f.nome_cliente}</td>
                <td>{f.referencia}</td>

                <td>{(f.precofinal || 0).toFixed(2)} €</td>
                <td>{(f.precocliente || 0).toFixed(2)} €</td>

                <td>{f.margem}%</td>
                <td>{f.comissao}%</td>

                <td className="acoes-coluna">

                  <button
                    className="btn-acao"
                    onClick={() => navigate(`/formulario?id=${f.id}`)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-acao"
                    onClick={() => navigate(`/cliente/${f.id}`)}
                  >
                    Ver Ficha
                  </button>

                  <button
                    className="btn-acao"
                    onClick={() => duplicarLinha(f.id)}
                  >
                    Duplicar
                  </button>

                  <button
                    className="btn-apagar"
                    onClick={() => apagarLinha(f.id)}
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
