import { supabase } from "../supabaseClient";

/* ============================================================
   📌 OBTER TODAS AS FICHAS
   ============================================================ */
export async function getTodasFichas() {
  const { data, error } = await supabase
    .from("fichas_preco")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar fichas:", error);
    return [];
  }

  return data || [];
}

/* ============================================================
   📌 OBTER FICHA DE UM CLIENTE
   ============================================================ */
export async function getFichaCliente(cliente) {
  const { data, error } = await supabase
    .from("fichas_preco")
    .select("*")
    .eq("nome_cliente", cliente)
    .single();

  if (error) return null;
  return data;
}

/* ============================================================
   💾 GUARDAR FICHA COMPLETA
   ============================================================ */
export async function guardarFichaCompleta(cliente, dados) {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) {
    console.error("Utilizador não autenticado.");
    return;
  }

  const ficha = {
    nome_cliente: cliente,
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

    precocliente: dados.precoCliente || 0,

    user_id: user.id,
    atualizadoEm: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("fichas_preco")
    .insert(ficha);

  if (error) {
    console.error("Erro ao guardar ficha:", error);
  }
}

/* ============================================================
   🗑️ APAGAR FICHA
   ============================================================ */
export async function apagarFicha(cliente) {
  await supabase
    .from("fichas_preco")
    .delete()
    .eq("nome_cliente", cliente);
}

/* ============================================================
   📄 DUPLICAR FICHA
   ============================================================ */
export async function duplicarFicha(cliente) {
  const ficha = await getFichaCliente(cliente);
  if (!ficha) return;

  const nova = {
    ...ficha,
    id: undefined,
    nome_cliente: ficha.nome_cliente + " (cópia)",
    atualizadoEm: new Date().toISOString(),
  };

  await supabase.from("fichas_preco").insert(nova);
}
