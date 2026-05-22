import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function FichaPreco() {
  const [nomeCliente, setNomeCliente] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [precoCliente, setPrecoCliente] = useState("");
  const [referencia, setReferencia] = useState("");

  async function guardarFicha() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      alert("Erro: utilizador não autenticado.");
      return;
    }

    const { error } = await supabase.from("fichas_preco").insert({
      nome_cliente: nomeCliente,
      descricao,
      valor,
      precocliente: precoCliente,
      referencia,
      user_id: user.id,
    });

    if (error) {
      console.error(error);
      alert("Erro ao guardar ficha.");
      return;
    }

    alert("Ficha guardada com sucesso!");

    setNomeCliente("");
    setDescricao("");
    setValor("");
    setPrecoCliente("");
    setReferencia("");
  }

  return (
    <div className="ficha-preco-container">

      <h2>Nova Ficha de Preço</h2>

      <input
        type="text"
        placeholder="Cliente"
        value={nomeCliente}
        onChange={(e) => setNomeCliente(e.target.value)}
      />

      <input
        type="text"
        placeholder="Referência"
        value={referencia}
        onChange={(e) => setReferencia(e.target.value)}
      />

      <textarea
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />

      <input
        type="number"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />

      <input
        type="number"
        placeholder="Preço Cliente"
        value={precoCliente}
        onChange={(e) => setPrecoCliente(e.target.value)}
      />

      <button onClick={guardarFicha}>Guardar Ficha</button>
    </div>
  );
}
