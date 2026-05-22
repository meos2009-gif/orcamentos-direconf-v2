import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFichaPorId } from "../state/precos";

export default function FichaCliente() {
  const { id } = useParams();
  const [ficha, setFicha] = useState(null);

  useEffect(() => {
    async function carregar() {
      if (!id) return;
      const dados = await getFichaPorId(id);
      setFicha(dados);
    }
    carregar();
  }, [id]);

  if (!ficha) {
    return <p style={{ color: "#fff", padding: "20px" }}>A carregar ficha...</p>;
  }

  return (
    <div className="card-premium" style={{ padding: "30px" }}>
      <h2 className="titulo-premium">Ficha de Preço</h2>

      <p><b>Cliente:</b> {ficha.nome_cliente}</p>
      <p><b>Referência:</b> {ficha.referencia}</p>
      <p><b>Descrição:</b> {ficha.descricao}</p>

      <p><b>Preço Final:</b> {ficha.valor?.toFixed(2)} €</p>
      <p><b>Preço Cliente:</b> {ficha.precocliente?.toFixed(2)} €</p>

      <p><b>Criado em:</b> {new Date(ficha.created_at).toLocaleString()}</p>
    </div>
  );
}
