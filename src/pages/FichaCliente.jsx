import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFichaPorId } from "../state/precos";

export default function FichaCliente() {
  const { id } = useParams();
  const [ficha, setFicha] = useState(null);

  useEffect(() => {
    async function carregar() {
      const f = await getFichaPorId(id);
      setFicha(f || null);
    }
    carregar();
  }, [id]);

  if (!ficha) return <p className="texto-vazio">A carregar ficha...</p>;

  const extras = ficha.variaveis || {};

  return (
    <div className="card-premium">
      <h2 className="titulo-premium">Ficha de Preço</h2>

      <p><b>Cliente:</b> {ficha.nome_cliente}</p>
      <p><b>Referência:</b> {ficha.referencia}</p>
      <p><b>Descrição do Tecido:</b> {ficha.descricaotecido}</p>

      <h3>Tecidos</h3>
      <p><b>Tecido 1:</b> Consumo {ficha.tecido1?.consumo} | Preço {ficha.tecido1?.preco}</p>
      <p><b>Tecido 2:</b> Consumo {ficha.tecido2?.consumo} | Preço {ficha.tecido2?.preco}</p>

      <h3>Extras</h3>
      {Object.keys(extras).length === 0 && <p>Sem extras.</p>}
      {Object.entries(extras).map(([nome, valor]) => (
        <p key={nome}>
          <b>{nome}:</b> {valor} €
        </p>
      ))}

      <h3>Totais</h3>
      <p><b>Custo Total Tecidos:</b> {ficha.custototaltecidos} €</p>
      <p><b>Total Extras:</b> {ficha.totalextras} €</p>
      <p><b>Margem:</b> {ficha.margem}%</p>
      <p><b>Comissão:</b> {ficha.comissao}%</p>
      <p><b>Preço Final:</b> {ficha.precofinal} €</p>
      <p><b>Preço Cliente:</b> {ficha.precocliente} €</p>
    </div>
  );
}
