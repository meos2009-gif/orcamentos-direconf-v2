import { supabase } from "../supabaseClient";

/* ============================================================
   🔐 CHAVE POR UTILIZADOR (ASSÍNCRONO E CORRETO)
   ============================================================ */
export async function getUserKey() {
  const { data } = await supabase.auth.getSession();
  const user = data?.session?.user;
  if (!user) return null;
  return "fichas_" + user.id;
}

/* ============================================================
   📌 OBTER TODAS AS FICHAS
   ============================================================ */
export async function getTodasFichas() {
  const key = await getUserKey();
  if (!key) return [];
  return JSON.parse(localStorage.getItem(key) || "[]");
}

/* ============================================================
   📌 OBTER FICHA DE UM CLIENTE
   ============================================================ */
export async function getFichaCliente(cliente) {
  const fichas = await getTodasFichas();
  return fichas.find((f) => f.cliente === cliente) || null;
}

/* ============================================================
   💾 GUARDAR / ATUALIZAR FICHA COMPLETA
   ============================================================ */
export async function guardarFichaCompleta(cliente, dados) {
  const key = await getUserKey();
  if (!key) return;

  const fichas = await getTodasFichas();

  const index = fichas.findIndex((f) => f.cliente === cliente);

  const novaFicha = {
  cliente,
  referencia: dados.referencia || "",
  descricaoTecido: dados.descricaoTecido || "",
  tecido1: dados.tecido1 || { consumo: "", preco: "" },
  tecido2: dados.tecido2 || { consumo: "", preco: "" },

  custoTecido1: dados.custoTecido1 || 0,
  custoTecido2: dados.custoTecido2 || 0,
  custoTotalTecidos: dados.custoTotalTecidos || 0,

  totalExtras: dados.totalExtras || 0,
  variaveis: dados.variaveis || {},

  margem: dados.margem || 0,
  precoFinal: dados.precoFinal || 0,
  precoComMargem: dados.precoComMargem || 0,
  comissao: dados.comissao || 0,
  precoComComissao: dados.precoComComissao || 0,

  // ⭐ NOVO CAMPO — AGORA VAI GUARDAR
  precoCliente: dados.precoCliente || 0,

  atualizadoEm: new Date().toISOString(),
};

  if (index >= 0) {
    fichas[index] = novaFicha;
  } else {
    fichas.push(novaFicha);
  }

  localStorage.setItem(key, JSON.stringify(fichas));
}

/* ============================================================
   🗑️ APAGAR FICHA
   ============================================================ */
export async function apagarFicha(cliente) {
  const key = await getUserKey();
  if (!key) return;

  const fichas = await getTodasFichas();
  const novas = fichas.filter((f) => f.cliente !== cliente);

  localStorage.setItem(key, JSON.stringify(novas));
}

/* ============================================================
   📄 DUPLICAR FICHA
   ============================================================ */
export async function duplicarFicha(cliente) {
  const key = await getUserKey();
  if (!key) return;

  const fichas = await getTodasFichas();
  const ficha = fichas.find((f) => f.cliente === cliente);
  if (!ficha) return;

  const novaFicha = {
    ...ficha,
    cliente: ficha.cliente + " (cópia)",
    atualizadoEm: new Date().toISOString(),
  };

  fichas.push(novaFicha);
  localStorage.setItem(key, JSON.stringify(fichas));
}
