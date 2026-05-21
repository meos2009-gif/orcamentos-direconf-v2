import * as XLSX from "xlsx";

export function exportarExcelCliente(nome, ficha) {
  const wsData = [
    ["FICHA DE PREÇO DO CLIENTE"],
    [],
    ["Cliente:", nome],
    ["Referência:", ficha.referencia],
    ["Descrição do Tecido:", ficha.descricaoTecido],
    [],
    ["CUSTO DOS TECIDOS"],
    ["Tecido 1", "", "", ficha.custoTecido1.toFixed(2) + " €"],
    ["Tecido 2", "", "", ficha.custoTecido2.toFixed(2) + " €"],
    ["Custo Total Tecidos:", "", "", ficha.custoTotalTecidos.toFixed(2) + " €"],
    [],
    ["CUSTOS VARIÁVEIS"],
    ...Object.entries(ficha.variaveis || {}).map(([k, v]) => [
      k,
      "",
      "",
      parseFloat(v).toFixed(2) + " €",
    ]),
    ["Total Extras:", "", "", ficha.totalExtras.toFixed(2) + " €"],
    [],
    ["MARGEM E COMISSÃO"],
    ["Margem:", "", "", ficha.margem + " %"],
    ["Preço com Margem:", "", "", ficha.precoComMargem.toFixed(2) + " €"],
    ["Comissão:", "", "", ficha.comissao + " %"],
    ["Preço Final c/ Comissão:", "", "", ficha.precoComComissao.toFixed(2) + " €"],
    [],
    ["RESUMO FINAL"],
    ["Custo Total Tecidos:", "", "", ficha.custoTotalTecidos.toFixed(2) + " €"],
    ["Total Extras:", "", "", ficha.totalExtras.toFixed(2) + " €"],
    ["Preço Final s/ Comissão:", "", "", ficha.precoComMargem.toFixed(2) + " €"],
    ["Preço Final c/ Comissão:", "", "", ficha.precoComComissao.toFixed(2) + " €"],
    [],
    ["ASSINATURA / OBSERVAÇÕES"],
    [""],
    [""],
    [""],
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Largura das colunas (mais largo, mais premium)
  ws["!cols"] = [
    { wch: 35 },
    { wch: 20 },
    { wch: 20 },
    { wch: 25 },
  ];

  // Altura das linhas (mais presença)
  ws["!rows"] = Array(wsData.length).fill({ hpt: 26 });

  // Estilos premium
  const headerStyle = {
    font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "1E293B" } },
    alignment: { horizontal: "center" },
  };

  const sectionStyle = {
    font: { bold: true, sz: 13, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "334155" } },
  };

  const labelStyle = {
    font: { bold: true },
    alignment: { horizontal: "left" },
  };

  const valueStyle = {
    alignment: { horizontal: "right" },
  };

  // Aplicar estilos
  Object.keys(ws).forEach((cell) => {
    if (cell.startsWith("A1")) ws[cell].s = headerStyle;

    const row = parseInt(cell.replace(/[A-Z]/g, ""));
    const col = cell.replace(/[0-9]/g, "");

    // Secções
    if (
      ws[cell].v === "CUSTO DOS TECIDOS" ||
      ws[cell].v === "CUSTOS VARIÁVEIS" ||
      ws[cell].v === "MARGEM E COMISSÃO" ||
      ws[cell].v === "RESUMO FINAL" ||
      ws[cell].v === "ASSINATURA / OBSERVAÇÕES"
    ) {
      ws[cell].s = sectionStyle;
    }

    // Labels
    if (col === "A" && row > 1 && ws[cell].v && typeof ws[cell].v === "string") {
      ws[cell].s = labelStyle;
    }

    // Valores
    if (col === "D" && row > 1) {
      ws[cell].s = valueStyle;
    }
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Ficha");

  XLSX.writeFile(wb, `Ficha_${nome}.xlsx`);
}
