import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFichaCliente } from "../state/precos";
import { saveAs } from "file-saver";

export default function FichaCliente() {
  const { cliente } = useParams();
  const navigate = useNavigate();

  const [ficha, setFicha] = useState(null);

  useEffect(() => {
    async function carregar() {
      const dados = await getFichaCliente(cliente);
      setFicha(dados);
    }
    carregar();
  }, [cliente]);

  if (!ficha) {
    return (
      <div className="card-premium">
        <h2 className="titulo-premium">Ficha de Preço</h2>
        <p className="texto-vazio">Nenhuma ficha encontrada.</p>
      </div>
    );
  }

  // ⭐ EXPORTAÇÃO EXCEL PREMIUM COMPLETA
  function exportarExcel() {
  const arred = (v) => Number(v).toFixed(2);

  let extrasHTML = "";
  for (const [nome, valor] of Object.entries(ficha.variaveis)) {
    extrasHTML += `
      <tr>
        <td style="padding:4px 6px;">${nome}</td>
        <td style="padding:4px 6px;">${arred(valor)}</td>
      </tr>
    `;
  }

  const html = `
    <table style="border-collapse:collapse; font-family:Arial; font-size:14px; width:100%;">

      <!-- TÍTULO -->
      <tr>
        <td colspan="2" style="background:#222; color:white; font-size:18px; font-weight:bold; padding:10px; border:2px solid #000; text-align:center;">
          FICHA DE PREÇO — ${cliente}
        </td>
      </tr>

      <tr>
        <!-- COLUNA ESQUERDA -->
        <td style="vertical-align:top; width:50%; border:2px solid #000; padding:0;">

          <!-- INFO BASE -->
          <table style="width:100%; border-collapse:collapse;">
            <tr><td colspan="2" style="background:#444; color:white; font-weight:bold; padding:6px;">Informação Base</td></tr>

            <tr><td style="padding:6px;">Cliente</td><td style="padding:6px;">${cliente}</td></tr>
            <tr><td style="padding:6px;">Referência</td><td style="padding:6px;">${ficha.referencia}</td></tr>
            <tr><td style="padding:6px;">Descrição</td><td style="padding:6px;">${ficha.descricaoTecido}</td></tr>
          </table>

          <!-- CUSTOS VARIÁVEIS -->
          <table style="width:100%; border-collapse:collapse; margin-top:10px;">
            <tr><td colspan="2" style="background:#444; color:white; font-weight:bold; padding:6px;">Custos Variáveis</td></tr>

            ${extrasHTML}

            <tr style="background:#eee; font-weight:bold;">
              <td style="padding:6px;">Total Extras</td>
              <td style="padding:6px;">${arred(ficha.totalExtras)}</td>
            </tr>
          </table>

        </td>

        <!-- COLUNA DIREITA -->
        <td style="vertical-align:top; width:50%; border:2px solid #000; padding:0;">

          <!-- TECIDO 1 -->
          <table style="width:100%; border-collapse:collapse;">
            <tr><td colspan="2" style="background:#444; color:white; font-weight:bold; padding:6px;">Tecido 1</td></tr>

            <tr><td style="padding:6px;">Consumo</td><td style="padding:6px;">${ficha.tecido1.consumo}</td></tr>
            <tr><td style="padding:6px;">Preço</td><td style="padding:6px;">${ficha.tecido1.preco}</td></tr>
            <tr><td style="padding:6px;">Custo</td><td style="padding:6px;">${arred(ficha.custoTecido1)}</td></tr>
          </table>

          <!-- TECIDO 2 -->
          <table style="width:100%; border-collapse:collapse; margin-top:10px;">
            <tr><td colspan="2" style="background:#444; color:white; font-weight:bold; padding:6px;">Tecido 2</td></tr>

            <tr><td style="padding:6px;">Consumo</td><td style="padding:6px;">${ficha.tecido2.consumo}</td></tr>
            <tr><td style="padding:6px;">Preço</td><td style="padding:6px;">${ficha.tecido2.preco}</td></tr>
            <tr><td style="padding:6px;">Custo</td><td style="padding:6px;">${arred(ficha.custoTecido2)}</td></tr>
          </table>

          <!-- TOTAIS -->
          <table style="width:100%; border-collapse:collapse; margin-top:10px;">
            <tr><td colspan="2" style="background:#444; color:white; font-weight:bold; padding:6px;">Totais</td></tr>

            <tr><td style="padding:6px;">Preço de Custo</td><td style="padding:6px;">${arred(ficha.precoFinal)}</td></tr>
            <tr><td style="padding:6px;">Preço com Margem</td><td style="padding:6px;">${arred(ficha.precoComMargem)}</td></tr>
            <tr><td style="padding:6px;">Preço Final Real</td><td style="padding:6px;">${arred(ficha.precoComComissao)}</td></tr>

            <tr style="background:#d9ffd9; font-weight:bold;">
              <td style="padding:6px;">Preço Cliente</td>
              <td style="padding:6px;">${arred(ficha.precoCliente)}</td>
            </tr>

            <tr><td style="padding:6px;">Margem (%)</td><td style="padding:6px;">${ficha.margem}</td></tr>
            <tr><td style="padding:6px;">Comissão (%)</td><td style="padding:6px;">${ficha.comissao}</td></tr>
          </table>

        </td>
      </tr>

    </table>
  `;

  const blob = new Blob([html], {
    type: "application/vnd.ms-excel;charset=utf-8;"
  });

  saveAs(blob, `Ficha_${cliente}.xls`);
}



  return (
    <div className="card-premium">
      <h2 className="titulo-premium">Ficha de Preço — {cliente}</h2>

      <div className="ficha-bloco">
        <h3>Informação Base</h3>
        <p><b>Referência:</b> {ficha.referencia}</p>
        <p><b>Descrição do Tecido:</b> {ficha.descricaoTecido}</p>
      </div>

      <div className="ficha-bloco">
        <h3>Tecidos</h3>

        <p><b>Tecido 1:</b> Consumo {ficha.tecido1.consumo}, Preço {ficha.tecido1.preco} €</p>
        <p><b>Tecido 2:</b> Consumo {ficha.tecido2.consumo}, Preço {ficha.tecido2.preco} €</p>

        <p><b>Custo Tecido 1:</b> {ficha.custoTecido1.toFixed(2)} €</p>
        <p><b>Custo Tecido 2:</b> {ficha.custoTecido2.toFixed(2)} €</p>
        <p><b>Custo Total Tecidos:</b> {ficha.custoTotalTecidos.toFixed(2)} €</p>
      </div>

      <div className="ficha-bloco">
        <h3>Custos Variáveis</h3>

        {Object.keys(ficha.variaveis).length === 0 && <p>Sem custos adicionais.</p>}

        {Object.entries(ficha.variaveis).map(([nome, valor]) => (
          <p key={nome}><b>{nome}:</b> {parseFloat(valor).toFixed(2)} €</p>
        ))}

        <p><b>Total Extras:</b> {ficha.totalExtras.toFixed(2)} €</p>
      </div>

      <div className="ficha-bloco">
        <h3>Totais</h3>

        <p><b>Preço de Custo:</b> {ficha.precoFinal.toFixed(2)} €</p>
        <p><b>Preço com Margem:</b> {ficha.precoComMargem.toFixed(2)} €</p>
        <p><b>Margem:</b> {ficha.margem}%</p>
        <p><b>Comissão:</b> {ficha.comissao}%</p>
        <p><b>Preço Final:</b> {(ficha.precoCliente || 0).toFixed(2)} €</p>
      </div>

      <div className="ficha-acoes">
        <button className="btn-acao" onClick={() => navigate(`/formulario?cliente=${cliente}`)}>Editar</button>
        <button className="btn-acao" onClick={() => navigate(`/formulario?duplicar=${cliente}`)}>Duplicar</button>
        <button className="btn-acao" onClick={() => window.print()}>Imprimir</button>
        <button className="btn-acao" onClick={exportarExcel}>Exportar Excel</button>
        <button className="btn-acao" onClick={() => navigate("/fichas")}>Voltar</button>
      </div>
    </div>
  );
}
