// ExportPrecoExcelButton.jsx
import * as XLSX from "xlsx";

function buildFichaWorksheet(preco) {
  // preco = {
  //   referencia, cliente, data,
  //   precoFinal, precoCliente, margem, comissao,
  //   precoComMargem, precoComComissao,
  //   custoTecido1, custoTecido2, custoTotalTecidos,
  //   totalExtras, precoFinalCusto,
  //   tempos, pesos, argumentos
  // }

  const wsData = [];

  // ===== CABEÇALHO =====
  wsData.push([`Ficha de Preço – ${preco.referencia}`]);
  wsData.push([`Cliente: ${preco.cliente}`]);
  wsData.push([`Referência: ${preco.referencia}`]);
  wsData.push([`Data: ${preco.data}`]);
  wsData.push([]); // linha em branco

  // ===== PREÇO DE VENDA =====
  wsData.push(["PREÇO DE VENDA"]);
  wsData.push(["Campo", "Valor"]);
  wsData.push(["Preço 1 (Preço Final)", preco.precoFinal]);
  wsData.push(["Preço 2 (Preço Cliente)", preco.precoCliente]);
  wsData.push(["Margem (%)", preco.margem]);
  wsData.push(["Comissão (%)", preco.comissao]);
  wsData.push(["Preço com Margem", preco.precoComMargem]);
  wsData.push(["Preço com Comissão", preco.precoComComissao]);
  wsData.push([]);

  // ===== TEMPOS =====
  wsData.push(["TEMPOS"]);
  wsData.push(["Descrição", "Valor"]);
  (preco.tempos || []).forEach((t) => {
    wsData.push([t.descricao || t.nome || "", t.valor ?? ""]);
  });
  wsData.push([]);

  // ===== PESOS =====
  wsData.push(["PESOS"]);
  wsData.push(["Descrição", "Valor"]);
  (preco.pesos || []).forEach((p) => {
    wsData.push([p.descricao || p.nome || "", p.valor ?? ""]);
  });
  wsData.push([]);

  // ===== ARGUMENTOS =====
  wsData.push(["ARGUMENTOS"]);
  wsData.push(["Descrição", "Valor"]);
  (preco.argumentos || []).forEach((a) => {
    wsData.push([a.descricao || a.nome || "", a.valor ?? ""]);
  });
  wsData.push([]);

  // ===== PREÇO DE CUSTO =====
  wsData.push(["PREÇO DE CUSTO"]);
  wsData.push(["Campo", "Valor"]);
  wsData.push(["Custo tecido 1", preco.custoTecido1]);
  wsData.push(["Custo tecido 2", preco.custoTecido2]);
  wsData.push(["Total tecidos", preco.custoTotalTecidos]);
  wsData.push(["Total extras", preco.totalExtras]);
  wsData.push(["Preço final de custo", preco.precoFinalCusto]);

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Mesclar título (linha 1, col A:B)
  ws["!merges"] = ws["!merges"] || [];
  ws["!merges"].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } });

  // Larguras de coluna
  ws["!cols"] = [{ wch: 35 }, { wch: 20 }];

  return ws;
}

export default function ExportPrecoExcelButton({ preco }) {
  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = buildFichaWorksheet(preco);

    XLSX.utils.book_append_sheet(wb, ws, "Ficha");

    const fileName = `${preco.cliente} - ${preco.referencia}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <button onClick={handleExport}>
      Exportar ficha para Excel
    </button>
  );
}
