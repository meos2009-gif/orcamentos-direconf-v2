import * as XLSX from "xlsx";

export function exportarFichaParaExcel(ficha) {
  if (!ficha) return;

  const linhas = [];

  // Informação base
  linhas.push(["Cliente", ficha.nome_cliente]);
  linhas.push(["Referência", ficha.referencia]);
  linhas.push(["Descrição do tecido", ficha.descricaotecido]);
  linhas.push([]);

  // Tecidos
  linhas.push(["Tecido 1"]);
  linhas.push(["Consumo", ficha.tecido1?.consumo || ""]);
  linhas.push(["Preço", ficha.tecido1?.preco || ""]);
  linhas.push(["Custo", ficha.custotecido1?.toFixed(2) || "0.00"]);
  linhas.push([]);

  linhas.push(["Tecido 2"]);
  linhas.push(["Consumo", ficha.tecido2?.consumo || ""]);
  linhas.push(["Preço", ficha.tecido2?.preco || ""]);
  linhas.push(["Custo", ficha.custotecido2?.toFixed(2) || "0.00"]);
  linhas.push([]);

  // Variáveis dinâmicas
  linhas.push(["Custos Variáveis"]);
  if (ficha.variaveis && Object.keys(ficha.variaveis).length > 0) {
    Object.entries(ficha.variaveis).forEach(([nome, valor]) => {
      linhas.push([nome, parseFloat(valor).toFixed(2)]);
    });
  } else {
    linhas.push(["Nenhuma variável"]);
  }
  linhas.push([]);

  // Totais
  linhas.push(["Totais"]);
  linhas.push(["Custo Total Tecidos", ficha.custototaltecidos?.toFixed(2)]);
  linhas.push(["Total Extras", ficha.totalextras?.toFixed(2)]);
  linhas.push(["Margem (%)", ficha.margem]);
  linhas.push(["Preço com Margem", ficha.precocommargem?.toFixed(2)]);
  linhas.push(["Comissão (%)", ficha.comissao]);
  linhas.push(["Preço com Comissão", ficha.precocomcomissao?.toFixed(2)]);
  linhas.push(["Preço Final", ficha.precofinal?.toFixed(2)]);
  linhas.push(["Preço Cliente", ficha.precocliente?.toFixed(2)]);
  linhas.push([]);

  // Criar workbook
  const ws = XLSX.utils.aoa_to_sheet(linhas);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Ficha de Preço");

  // Nome do ficheiro
  const nomeFicheiro = `Ficha_${ficha.nome_cliente}_${ficha.referencia || ""}.xlsx`
    .replace(/\s+/g, "_")
    .replace(/[()]/g, "");

  XLSX.writeFile(wb, nomeFicheiro);
}
