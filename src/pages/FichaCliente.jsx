import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFichaPorId } from "../state/precos";
import { exportarFichaParaExcel } from "../utils/exportExcel";

export default function FichaCliente() {
  const { id } = useParams();
  const navigate = useNavigate();

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
    return (
      <div className="card-premium" style={{ padding: "20px" }}>
        <p>A carregar ficha...</p>
      </div>
    );
  }

  return (
    <div className="card-premium" style={{ padding: "30px" }}>
      <h2 className="titulo-premium">Ficha de Preço — {ficha.nome_cliente}</h2>

      <div className="ficha-grid">

        {/* COLUNA ESQUERDA */}
        <div className="ficha-col">

          <h3>Informação Base</h3>
          <p><b>Cliente:</b> {ficha.nome_cliente}</p>
          <p><b>Referência:</b> {ficha.referencia}</p>
          <p><b>Descrição do tecido:</b> {ficha.descricaotecido}</p>

          <h3>Custos Variáveis</h3>
          {ficha.variaveis && Object.keys(ficha.variaveis).length > 0 ? (
            Object.entries(ficha.variaveis).map(([nome, valor]) => (
              <p key={nome}>
                <b>{nome}:</b> {(parseFloat(valor ?? 0)).toFixed(2)} €
              </p>
            ))
          ) : (
            <p>Sem variáveis adicionais.</p>
          )}

        </div>

        {/* COLUNA DIREITA */}
        <div className="ficha-col">

          <h3>Tecido 1</h3>
          {ficha.tecido1 ? (
            <>
              <p><b>Consumo:</b> {ficha.tecido1.consumo}</p>
              <p><b>Preço:</b> {ficha.tecido1.preco}</p>
              <p><b>Custo:</b> {(ficha.custotecido1 ?? 0).toFixed(2)} €</p>
            </>
          ) : (
            <p>Sem dados.</p>
          )}

          <h3>Tecido 2</h3>
          {ficha.tecido2 ? (
            <>
              <p><b>Consumo:</b> {ficha.tecido2.consumo}</p>
              <p><b>Preço:</b> {ficha.tecido2.preco}</p>
              <p><b>Custo:</b> {(ficha.custotecido2 ?? 0).toFixed(2)} €</p>
            </>
          ) : (
            <p>Sem dados.</p>
          )}

          <h3>Totais</h3>
          <p><b>Custo Total Tecidos:</b> {(ficha.custototaltecidos ?? 0).toFixed(2)} €</p>
          <p><b>Total Extras:</b> {(ficha.totalextras ?? 0).toFixed(2)} €</p>

          <p><b>Margem:</b> {ficha.margem ?? 0}%</p>
          <p><b>Preço com Margem:</b> {(ficha.precocommargem ?? 0).toFixed(2)} €</p>

          <p><b>Comissão:</b> {ficha.comissao ?? 0}%</p>
          <p><b>Preço com Comissão:</b> {(ficha.precocomcomissao ?? 0).toFixed(2)} €</p>

          <p><b>Preço Final:</b> {(ficha.precofinal ?? 0).toFixed(2)} €</p>
          <p><b>Preço Cliente:</b> {(ficha.precocliente ?? 0).toFixed(2)} €</p>

        </div>
      </div>

      {/* BOTÕES — VERSÃO FINAL */}
      <div className="ficha-botoes">

        <button
          className="btn-acao"
          onClick={() => navigate(`/formulario?id=${ficha.id}`)}
        >
          Editar
        </button>

        <button
          className="btn-acao"
          onClick={() => navigate(`/formulario?duplicar=${ficha.id}`)}
        >
          Duplicar
        </button>

        <button
          className="btn-apagar"
          onClick={() => navigate("/fichas")}
        >
          Voltar
        </button>

        <button
          className="btn-acao"
          onClick={() => exportarFichaParaExcel(ficha)}
        >
          Exportar Excel
        </button>

      </div>
    </div>
  );
}
