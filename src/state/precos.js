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
   📌 OBTER FICHA POR ID
   ============================================================ */
export async function getFichaPorId(id) {
  const { data, error } = await supabase
    .from("fichas_preco")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erro ao obter ficha:", error);
    return null;
  }

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
    descricaotecido: dados.descricaoTecido || "",

    tecido1: dados.tecido1 || {},
    tecido2: dados.tecido2 || {},

    custotecido1: dados.custoTecido1 || 0,
    custotecido2: dados.custoTecido2 || 0,
    custototaltecidos: dados.custoTotalTecidos || 0,
    totalextras: dados.totalExtras || 0,

    variaveis: dados.variaveis || {},

    margem: dados.margem || 0,
    precocommargem: dados.precoComMargem || 0,
    comissao: dados.comissao || 0,
    precofinal: dados.precoFinal || 0,
    precocomcomissao: dados.precoComComissao || 0,

    precocliente: dados.precoCliente || 0,

    user_id: user.id,
    atualizadoem: new Date().toISOString(),
  };

  const { error } = await supabase.from("fichas_preco").insert(ficha);

  if (error) {
    console.error("Erro ao guardar ficha:", error);
  }
}

/* ============================================================
   🗑️ APAGAR FICHA POR ID
   ============================================================ */
export async function apagarFicha(id) {
  const { error } = await supabase
    .from("fichas_preco")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao apagar ficha:", error);
  }
}

/* ============================================================
   📄 DUPLICAR FICHA POR ID
   ============================================================ */
export async function duplicarFicha(id) {
  const ficha = await getFichaPorId(id);
  if (!ficha) return;

  const nova = {
    ...ficha,
    id: undefined,
    nome_cliente: ficha.nome_cliente + " (cópia)",
    created_at: new Date().toISOString(),
    atualizadoem: new Date().toISOString(),
  };

  const { error } = await supabase.from("fichas_preco").insert(nova);

  if (error) {
    console.error("Erro ao duplicar ficha:", error);
  }
}
