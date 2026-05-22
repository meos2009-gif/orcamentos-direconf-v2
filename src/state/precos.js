import { supabase } from "../supabaseClient";

/* ============================================================
   📌 OBTER TODAS AS FICHAS (SUPABASE)
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
   📌 OBTER FICHA DE UM CLIENTE (SUPABASE)
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
   💾 GUARDAR / ATUALIZAR FICHA COMPLETA (SUPABASE)
   ============================================================ */
export async function guardarFichaCompleta(cliente, dados) {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) return;

  const ficha = {
    nome_cliente: cliente,
    referencia: dados.referencia || "",
    descricao: dados.descricaoTecido || "",
    valor: dados.precoComComissao || 0,
    precocliente: dados.precoCliente || 0,
    user_id: user.id,
  };

  const { error } = await supabase.from("fichas_preco").insert(ficha);

  if (error) console.error("Erro ao guardar ficha:", error);
}

/* ============================================================
   🗑️ APAGAR FICHA (SUPABASE)
   ============================================================ */
export async function apagarFicha(cliente) {
  await supabase
    .from("fichas_preco")
    .delete()
    .eq("nome_cliente", cliente);
}

/* ============================================================
   📄 DUPLICAR FICHA (SUPABASE)
   ============================================================ */
export async function duplicarFicha(cliente) {
  const ficha = await getFichaCliente(cliente);
  if (!ficha) return;

  const nova = {
    ...ficha,
    nome_cliente: ficha.nome_cliente + " (cópia)",
    created_at: new Date().toISOString(),
  };

  delete nova.id;

  await supabase.from("fichas_preco").insert(nova);
}
