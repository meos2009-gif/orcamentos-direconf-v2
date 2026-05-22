import * as XLSX from "xlsx";

export function exportarFichaParaExcel(ficha) {
  const wsData = [];

  wsData.push([`Ficha de Preço – ${ficha.referencia}`]);
  wsData.push([`Cliente: ${ficha.nome_cliente}`]);
  wsData.push([`Referência: ${ficha.referencia}`]);
  wsData.push([`Data: ${new Date().toLocaleDateString()}`]);
  wsData.push([]);

  wsData.push(["PREÇO DE VENDA"]);
  wsData.push(["Preço Final", ficha.precofinal]);
  wsData.push(["Preço Cliente", ficha.precocliente]);
  wsData.push(["Margem", ficha.margem]);
  wsData.push(["Comissão", ficha.comissao]);
  wsData.push(["Preço com Margem", ficha.precocommargem]);
  wsData.push(["Preço com Comissão", ficha.precocomcomissao]);
  wsData.push([]);

  wsData.push(["PREÇO DE CUSTO"]);
  wsData.push(["Custo tecido 1", ficha.custotecido1]);
  wsData.push(["Custo tecido 2", ficha.custotecido2]);
  wsData.push(["Total tecidos", ficha.custototaltecidos]);
  wsData.push(["Total extras", ficha.totalextras]);
  wsData.push(["Preço final custo", ficha.precofinal]);
  wsData.push([]);

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Ficha");

  const fileName = `${ficha.nome_cliente} - ${ficha.referencia}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
