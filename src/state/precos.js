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

  if (error) {
    console.error("Erro ao obter ficha:", error);
    return null;
  }

  return data;
}

/* ============================================================
   💾 GUARDAR FICHA COMPLETA (COMPATÍVEL COM A TABELA REAL)
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
    descricaotecido: dados.descricaoTecido || "",

    tecido1: dados.tecido1 || {},
    tecido2: dados.tecido2 || {},

    custotecido1: dados.custoTecido1 || 0,
    custotecido2: dados.custoTecido2 || 0,
    custototaltecidos: dados.custoTotalTecidos || 0,
    totalextras: dados.totalExtras || 0,

    variaveis: dados.variaveis || {},

    margem: dados.margem || 0,
    precofinal: dados.precoFinal || 0,
    precocommargem: dados.precoComMargem || 0,
    comissao: dados.comissao || 0,
    precocomcomissao: dados.precoComComissao || 0,

    precocliente: dados.precoCliente || 0,

    user_id: user.id,
    atualizadoem: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("fichas_preco")
    .insert(ficha)
    .select();

  console.log("📌 Enviado:", ficha);
  console.log("📌 Supabase:", data, error);

  if (error) {
    console.error("Erro ao guardar ficha:", error);
  }
}

/* ============================================================
   🗑️ APAGAR FICHA
   ============================================================ */
export async function apagarFicha(cliente) {
  const { error } = await supabase
    .from("fichas_preco")
    .delete()
    .eq("nome_cliente", cliente);

  if (error) {
    console.error("Erro ao apagar ficha:", error);
  }
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
    atualizadoem: new Date().toISOString(),
  };

  const { error } = await supabase.from("fichas_preco").insert(nova);

  if (error) {
    console.error("Erro ao duplicar ficha:", error);
  }
}
