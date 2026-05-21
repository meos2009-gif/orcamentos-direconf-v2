import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ListaFichas() {
  const [fichas, setFichas] = useState([]);
  const [pesqCliente, setPesqCliente] = useState("");
  const [pesqRef, setPesqRef] = useState("");

  async function carregarFichas() {
    let query = supabase.from("main").select("*");

    if (pesqCliente.trim() !== "") {
      query = query.ilike("nome_cliente", `%${pesqCliente}%`);
    }

    if (pesqRef.trim() !== "") {
      query = query.ilike("referencia", `%${pesqRef}%`);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (!error) setFichas(data);
  }

  useEffect(() => {
    carregarFichas();
  }, [pesqCliente, pesqRef]);

  return (
    <div className="lista-fichas">

      <div className="filtros">
        <input
          type="text"
          placeholder="Pesquisar Cliente"
          value={pesqCliente}
          onChange={(e) => setPesqCliente(e.target.value)}
        />

        <input
          type="text"
          placeholder="Pesquisar Referência"
          value={pesqRef}
          onChange={(e) => setPesqRef(e.target.value)}
        />
      </div>

      <div className="tabela">
        {fichas.map((ficha) => (
          <div key={ficha.id} className="linha">
            <strong>{ficha.nome_cliente}</strong> — {ficha.referencia}
          </div>
        ))}
      </div>

    </div>
  );
}
