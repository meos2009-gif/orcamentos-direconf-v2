import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { guardarFicha, getFichaPorId } from "../state/precos";
import { getVariaveis } from "../state/variaveis";
import { listarClientes } from "../state/clientes";

export default function FormularioPreco() {
  const [params] = useSearchParams();
  const idFicha = params.get("id");
  const duplicarId = params.get("duplicar");

  const [clientesDB, setClientesDB] = useState([]);

  const [cliente, setCliente] = useState("");
  const [referencia, setReferencia] = useState("");
  const [descricaoTecido, setDescricaoTecido] = useState("");

  const [tecido1, setTecido1] = useState({ consumo: "", preco: "" });
  const [tecido2, setTecido2] = useState({ consumo: "", preco: "" });

  const [extrasDinamicos, setExtrasDinamicos] = useState({});
  const [variaveis, setVariaveis] = useState([]);

  const [margem, setMargem] = useState("");
  const [comissao, setComissao] = useState("");

  const [precoCliente, setPrecoCliente] = useState("");

  // Arredondamento seguro
  const arred = (n) => {
    const v = parseFloat(n);
    if (!isFinite(v)) return 0;
    const r = Number(v.toFixed(2));
    return Object.is(r, -0) ? 0 : r;
  };

  // Carregar variáveis
  useEffect(() => {
    async function carregar() {
      const lista = await getVariaveis();
      setVariaveis(lista || []);
    }
    carregar();
  }, []);

  // Carregar clientes
  useEffect(() => {
    async function carregar() {
      const { data } = await listarClientes();
      setClientesDB(data || []);
    }
    carregar();
  }, []);

  // Carregar ficha
  useEffect(() => {
    async function carregarFicha() {
      if (!idFicha && !duplicarId) return;

      const ficha = await getFichaPorId(idFicha || duplicarId);
      if (!ficha) return;

      setCliente(
        duplicarId ? ficha.nome_cliente + " (cópia)" : ficha.nome_cliente
      );
      setReferencia(ficha.referencia || "");
      setDescricaoTecido(ficha.descricaotecido || "");

      setTecido1(ficha.tecido1 || { consumo: "", preco: "" });
      setTecido2(ficha.tecido2 || { consumo: "", preco: "" });

      setExtrasDinamicos(ficha.variaveis || {});

      setMargem(ficha.margem || "");
      setComissao(ficha.comissao || "");

      setPrecoCliente(ficha.precocliente || "");
    }

    carregarFicha();
  }, [idFicha, duplicarId]);

  // Cálculos seguros
  const consumo1 = parseFloat(tecido1.consumo) || 0;
  const preco1 = parseFloat(tecido1.preco) || 0;

  const consumo2 = parseFloat(tecido2.consumo) || 0;
  const preco2 = parseFloat(tecido2.preco) || 0;

  const custoTecido1 = arred(consumo1 * preco1);
  const custoTecido2 = arred(consumo2 * preco2);

  const custoTotalTecidos = arred(custoTecido1 + custoTecido2);

  const totalExtras = arred(
    Object.values(extrasDinamicos).reduce((acc, v) => {
      const num = parseFloat(v);
      return acc + (isFinite(num) ? num : 0);
    }, 0)
  );

  const margemNum = parseFloat(margem) || 0;
  const precoDeCusto = arred(custoTotalTecidos + totalExtras);

  const precoComMargem = arred(precoDeCusto * (1 + margemNum / 100));

  const comissaoNum = parseFloat(comissao) || 0;
  const precoFinal = arred(precoComMargem * (1 + comissaoNum / 100));

  // Guardar ficha
  async function guardar() {
    if (!cliente.trim()) return;

    await guardarFicha({
      id: idFicha || undefined,
      nome_cliente: cliente.trim(),
      referencia,
      descricaotecido: descricaoTecido,
      tecido1,
      tecido2,
      custotecido1: custoTecido1,
      custotecido2: custoTecido2,
      custototaltecidos: custoTotalTecidos,
      totalextras: totalExtras,
      variaveis: extrasDinamicos,
      margem: margemNum,
      precofinal: precoDeCusto,          // PREÇO DE CUSTO
      precocommargem: precoComMargem,
      comissao: comissaoNum,
      precocomcomissao: precoFinal,      // PREÇO FINAL
      precocliente: arred(precoCliente),
    });

    alert("Ficha guardada!");
  }

  return (
    <div className="form-premium-layout">

      {/* COLUNA ESQUERDA */}
      <div className="form-col-esquerda">

        <div className="form-card">
          <h3>Cliente</h3>

          <select
            className="input-premium"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
          >
            <option value="">Selecione um cliente...</option>
            {clientesDB.map((c) => (
              <option key={c.id} value={c.nome}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="form-card">
          <h3>Informação Base</h3>

          <label>Referência</label>
          <input
            className="input-premium"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
          />

          <label>Descrição do tecido</label>
          <input
            className="input-premium"
            value={descricaoTecido}
            onChange={(e) => setDescricaoTecido(e.target.value)}
          />

          <label>Preço Cliente</label>
          <input
            className="input-premium input-num"
            type="number"
            value={precoCliente}
            onChange={(e) => setPrecoCliente(e.target.value)}
          />
        </div>

        {/* VARIÁVEIS EM GRELHA + BOTÕES */}
        <div className="form-card">
          <h3>Custos Variáveis</h3>

          <div className="variaveis-grid">
            {variaveis.map((v) => (
              <div key={v.id} className="variavel-item">
                <span>{v.nome}</span>

                <div className="variavel-input-row">
                  <input
                    type="number"
                    className="input-premium input-num"
                    value={extrasDinamicos[v.nome] || ""}
                    onChange={(e) =>
                      setExtrasDinamicos({
                        ...extrasDinamicos,
                        [v.nome]: e.target.value,
                      })
                    }
                  />

                  <button
                    className="btn-inc"
                    onClick={() => {
                      const atual = parseFloat(extrasDinamicos[v.nome]) || 0;
                      setExtrasDinamicos({
                        ...extrasDinamicos,
                        [v.nome]: (atual + 0.10).toFixed(2),
                      });
                    }}
                  >
                    +0.10
                  </button>

                  <button
                    className="btn-inc"
                    onClick={() => {
                      const atual = parseFloat(extrasDinamicos[v.nome]) || 0;
                      setExtrasDinamicos({
                        ...extrasDinamicos,
                        [v.nome]: (atual + 1).toFixed(2),
                      });
                    }}
                  >
                    +1
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* COLUNA DIREITA */}
      <div className="form-col-direita">

        {/* TECIDO 1 */}
        <div className="form-card">
          <h3>Tecido 1</h3>

          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label>Consumo</label>
              <input
                className="input-premium input-num"
                value={tecido1.consumo}
                onChange={(e) =>
                  setTecido1({ ...tecido1, consumo: e.target.value })
                }
              />
            </div>

            <div style={{ flex: 1 }}>
              <label>Preço</label>
              <input
                className="input-premium input-num"
                value={tecido1.preco}
                onChange={(e) =>
                  setTecido1({ ...tecido1, preco: e.target.value })
                }
              />
            </div>
          </div>

          <div className="resultado-premium">
            Custo Tecido 1: <b>{custoTecido1} €</b>
          </div>
        </div>

        {/* TECIDO 2 */}
        <div className="form-card">
          <h3>Tecido 2</h3>

          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label>Consumo</label>
              <input
                className="input-premium input-num"
                value={tecido2.consumo}
                onChange={(e) =>
                  setTecido2({ ...tecido2, consumo: e.target.value })
                }
              />
            </div>

            <div style={{ flex: 1 }}>
              <label>Preço</label>
              <input
                className="input-premium input-num"
                value={tecido2.preco}
                onChange={(e) =>
                  setTecido2({ ...tecido2, preco: e.target.value })
                }
              />
            </div>
          </div>

          <div className="resultado-premium">
            Custo Tecido 2: <b>{custoTecido2} €</b>
          </div>
        </div>

        {/* TOTAIS */}
        <div className="form-card">
          <h3>Totais</h3>

          <p><b>Preço de Custo:</b> {precoDeCusto} €</p>
          <p><b>Preço com Margem:</b> {precoComMargem} €</p>

          <label>Margem (%)</label>
          <input
            className="input-premium input-num"
            value={margem}
            onChange={(e) => setMargem(e.target.value)}
          />

          <label>Comissão (%)</label>
          <input
            className="input-premium input-num"
            value={comissao}
            onChange={(e) => setComissao(e.target.value)}
          />

          <p><b>Preço Final:</b> {precoFinal} €</p>

          <button className="btn-guardar" onClick={guardar}>
            Guardar Ficha
          </button>
        </div>

      </div>

    </div>
  );
}
