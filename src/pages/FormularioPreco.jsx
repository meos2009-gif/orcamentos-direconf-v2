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

  // Carregar ficha para edição ou duplicação
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

      setTecido1(
        typeof ficha.tecido1 === "object" && ficha.tecido1 !== null
          ? ficha.tecido1
          : { consumo: "", preco: "" }
      );

      setTecido2(
        typeof ficha.tecido2 === "object" && ficha.tecido2 !== null
          ? ficha.tecido2
          : { consumo: "", preco: "" }
      );

      setExtrasDinamicos(
        typeof ficha.variaveis === "object" && ficha.variaveis !== null
          ? ficha.variaveis
          : {}
      );

      setMargem(ficha.margem || "");
      setComissao(ficha.comissao || "");

      setPrecoCliente(ficha.precocliente || "");
    }

    carregarFicha();
  }, [idFicha, duplicarId]);

  // Cálculos
  const custoTecido1 =
    (parseFloat(tecido1.consumo || 0) * parseFloat(tecido1.preco || 0)) || 0;

  const custoTecido2 =
    (parseFloat(tecido2.consumo || 0) * parseFloat(tecido2.preco || 0)) || 0;

  const custoTotalTecidos = custoTecido1 + custoTecido2;

  const totalExtras = Object.values(extrasDinamicos).reduce(
    (acc, v) => acc + (parseFloat(v) || 0),
    0
  );

  const margemNum = parseFloat(margem || 0);
  const precoDeCusto = custoTotalTecidos + totalExtras; // antigo precoFinal
  const precoComMargem = precoDeCusto * (1 + margemNum / 100);

  const comissaoNum = parseFloat(comissao || 0);
  const precoFinal = precoComMargem * (1 + comissaoNum / 100); // antigo precoComComissao

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
      precofinal: precoDeCusto, // <-- PREÇO DE CUSTO
      precocommargem: precoComMargem,
      comissao: comissaoNum,
      precocomcomissao: precoFinal, // <-- PREÇO FINAL
      precocliente: parseFloat(precoCliente || 0),
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
            className="input-premium"
            type="number"
            value={precoCliente}
            onChange={(e) => setPrecoCliente(e.target.value)}
          />
        </div>

        <div className="form-card">
          <h3>Custos Variáveis</h3>

          {variaveis.map((v) => (
            <div key={v.id} className="linha-variavel">
              <span>{v.nome}</span>
              <input
                type="number"
                className="input-premium"
                value={extrasDinamicos[v.nome] || ""}
                onChange={(e) =>
                  setExtrasDinamicos({
                    ...extrasDinamicos,
                    [v.nome]: e.target.value,
                  })
                }
              />
            </div>
          ))}
        </div>

      </div>

      {/* COLUNA DIREITA */}
      <div className="form-col-direita">

        <div className="form-card">
          <h3>Tecido 1</h3>

          <label>Consumo</label>
          <input
            className="input-premium"
            value={tecido1.consumo}
            onChange={(e) =>
              setTecido1({ ...tecido1, consumo: e.target.value })
            }
          />

          <label>Preço / unidade</label>
          <input
            className="input-premium"
            value={tecido1.preco}
            onChange={(e) =>
              setTecido1({ ...tecido1, preco: e.target.value })
            }
          />

          <div className="resultado-premium">
            Custo Tecido 1: <b>{custoTecido1.toFixed(2)} €</b>
          </div>
        </div>

        <div className="form-card">
          <h3>Tecido 2</h3>

          <label>Consumo</label>
          <input
            className="input-premium"
            value={tecido2.consumo}
            onChange={(e) =>
              setTecido2({ ...tecido2, consumo: e.target.value })
            }
          />

          <label>Preço / unidade</label>
          <input
            className="input-premium"
            value={tecido2.preco}
            onChange={(e) =>
              setTecido2({ ...tecido2, preco: e.target.value })
            }
          />

          <div className="resultado-premium">
            Custo Tecido 2: <b>{custoTecido2.toFixed(2)} €</b>
          </div>
        </div>

        <div className="form-card">
          <h3>Totais</h3>

          <p>Preço de Custo: <b>{precoDeCusto.toFixed(2)} €</b></p>
          <p>Preço com Margem: <b>{precoComMargem.toFixed(2)} €</b></p>

          <label>Margem (%)</label>
          <input
            className="input-premium"
            value={margem}
            onChange={(e) => setMargem(e.target.value)}
          />

          <label>Comissão (%)</label>
          <input
            className="input-premium"
            value={comissao}
            onChange={(e) => setComissao(e.target.value)}
          />

          <p>Preço Final: <b>{precoFinal.toFixed(2)} €</b></p>

          <button className="btn-guardar" onClick={guardar}>
            Guardar Ficha
          </button>
        </div>

      </div>

    </div>
  );
}
