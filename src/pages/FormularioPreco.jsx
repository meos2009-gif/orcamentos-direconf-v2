import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { guardarFichaCompleta, getFichaPorId } from "../state/precos";
import { getVariaveis } from "../state/variaveis";
import { listarClientes } from "../state/clientes";

export default function FormularioPreco() {
  const [params] = useSearchParams();
  const idFicha = params.get("id");

  const [clientesDB, setClientesDB] = useState([]);

  const [cliente, setCliente] = useState("");
  const [referencia, setReferencia] = useState("");
  const [descricaoTecido, setDescricaoTecido] = useState("");

  const [variaveis, setVariaveis] = useState([]);
  const [extrasDinamicos, setExtrasDinamicos] = useState({});

  const [margem, setMargem] = useState("");
  const [comissao, setComissao] = useState("");

  const [precoCliente, setPrecoCliente] = useState("");

  useEffect(() => {
    setVariaveis(getVariaveis());
  }, []);

  useEffect(() => {
    async function carregarClientes() {
      const { data } = await listarClientes();
      setClientesDB(data || []);
    }
    carregarClientes();
  }, []);

  useEffect(() => {
    async function carregarFicha() {
      if (!idFicha) return;

      const ficha = await getFichaPorId(idFicha);
      if (!ficha) return;

      setCliente(ficha.nome_cliente);
      setReferencia(ficha.referencia);
      setDescricaoTecido(ficha.descricao);
      setPrecoCliente(ficha.precocliente);
    }

    carregarFicha();
  }, [idFicha]);

  const precoFinal = 0; // cálculo opcional, mas não guardado

  async function guardar() {
    if (!cliente.trim()) return;

    await guardarFichaCompleta(cliente.trim(), {
      referencia,
      descricaoTecido,
      precoFinal,
      precoCliente: parseFloat(precoCliente || 0),
    });

    alert("Ficha guardada!");
  }

  return (
    <div className="form-premium-layout">

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

        <label>Descrição</label>
        <input
          className="input-premium"
          value={descricaoTecido}
          onChange={(e) => setDescricaoTecido(e.target.value)}
        />

        <label>Preço Cliente</label>
        <input
          className="input-premium"
          value={precoCliente}
          onChange={(e) => setPrecoCliente(e.target.value)}
        />

        <button className="btn-guardar" onClick={guardar}>
          Guardar Ficha
        </button>
      </div>

    </div>
  );
}
