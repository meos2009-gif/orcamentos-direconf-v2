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
    <div className="card-premium ficha-premium-container">

      <h1 className="titulo-premium-grande">
        Ficha de Preço
      </h1>

      {/* CLIENTE */}
      <div className="ficha-card">
        <h2 className="ficha-sec-titulo">Informação do Cliente</h2>
        <p><b>Cliente:</b> {ficha.nome_cliente}</p>
        <p><b>Referência:</b> {ficha.referencia}</p>
        <p><b>Descrição do Tecido:</b> {ficha.descricaotecido}</p>
      </div>

      {/* TECIDOS */}
      <div className="ficha-card">
        <h2 className="ficha-sec-titulo">Tecidos</h2>

        <div className="ficha-linha">
          <b>Tecido 1:</b>
          <span>Consumo {ficha.tecido1?.consumo} | Preço {ficha.tecido1?.preco}</span>
        </div>

        <div className="ficha-linha">
          <b>Tecido 2:</b>
          <span>Consumo {ficha.tecido2?.consumo} | Preço {ficha.tecido2?.preco}</span>
        </div>
      </div>

      {/* EXTRAS */}
      <div className="ficha-card">
        <h2 className="ficha-sec-titulo">Extras</h2>

        {Object.keys(extras).length === 0 && (
          <p>Sem extras.</p>
        )}

        {Object.entries(extras).map(([nome, valor]) => (
          <div key={nome} className="ficha-linha">
            <b>{nome}:</b>
            <span>{valor} €</span>
          </div>
        ))}
      </div>

      {/* TOTAIS */}
      <div className="ficha-card ficha-totais">
        <h2 className="ficha-sec-titulo">Totais</h2>

        <div className="ficha-linha">
          <b>Custo Total Tecidos:</b>
          <span>{ficha.custototaltecidos} €</span>
        </div>

        <div className="ficha-linha">
          <b>Total Extras:</b>
          <span>{ficha.totalextras} €</span>
        </div>

        <div className="ficha-linha">
          <b>Margem:</b>
          <span>{ficha.margem}%</span>
        </div>

        <div className="ficha-linha">
          <b>Comissão:</b>
          <span>{ficha.comissao}%</span>
        </div>

        <div className="ficha-linha destaque-premium">
          <b>Preço Final:</b>
          <span>{ficha.precofinal} €</span>
        </div>

        <div className="ficha-linha destaque-premium">
          <b>Preço Cliente:</b>
          <span>{ficha.precocliente} €</span>
        </div>
      </div>

    </div>
  );
}
