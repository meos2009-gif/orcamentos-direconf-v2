import { useState, useEffect } from "react";
import { getVariaveis, adicionarVariavel, apagarVariavel } from "../state/variaveis";

export default function ConfigurarVariaveis() {
  const [variaveis, setVariaveis] = useState([]);
  const [nova, setNova] = useState("");

  useEffect(() => {
    setVariaveis(getVariaveis());
  }, []);

  function adicionar() {
    if (!nova.trim()) return;
    adicionarVariavel(nova);
    setVariaveis(getVariaveis());
    setNova("");
  }

  function remover(id) {
    apagarVariavel(id);
    setVariaveis(getVariaveis());
  }

  return (
    <div className="card card-premium">

      <h2 className="titulo-premium">Configurar Variáveis</h2>

      {/* INPUT PREMIUM */}
      <div className="input-linha">
        <input
          type="text"
          className="input-premium"
          placeholder="Ex: Sacos, Caixas, Etiquetas..."
          value={nova}
          onChange={(e) => setNova(e.target.value)}
        />

        <button className="btn-primary" onClick={adicionar}>
          Adicionar
        </button>
      </div>

      <hr className="separador-premium" />

      <h3 className="subtitulo-premium">Variáveis Atuais</h3>

      <div className="lista-premium">
        {variaveis.map((v) => (
          <div key={v.id} className="item-premium">
            <span>{v.nome}</span>
            <button className="btn-apagar" onClick={() => remover(v.id)}>
              Apagar
            </button>
          </div>
        ))}

        {variaveis.length === 0 && (
          <p className="texto-vazio">Nenhuma variável configurada.</p>
        )}
      </div>
    </div>
  );
}
