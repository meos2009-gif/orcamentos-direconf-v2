import { supabase } from "../supabaseClient";

const TABELA = "fichas_preco";

export async function getTodasFichas() {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return [];

  const { data } = await supabase
    .from(TABELA)
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function getFichaPorId(id) {
  const { data } = await supabase
    .from(TABELA)
    .select("*")
    .eq("id", id)
    .single();

  return data;
}

export async function guardarFicha(ficha) {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return;

  const fichaFinal = {
    ...ficha,
    user_id: user.id,
    atualizadoem: new Date().toISOString(),
  };

  if (ficha.id) {
    await supabase.from(TABELA).update(fichaFinal).eq("id", ficha.id);
  } else {
    await supabase.from(TABELA).insert(fichaFinal);
  }
}

export async function apagarFicha(id) {
  await supabase.from(TABELA).delete().eq("id", id);
}

export async function duplicarFicha(id) {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;

  const { data } = await supabase
    .from(TABELA)
    .select("*")
    .eq("id", id)
    .single();

  if (!data) return;

  const copia = {
    ...data,
    id: undefined,
    referencia: data.referencia + "_COPIA",
    nome_cliente: data.nome_cliente + " (cópia)",
    user_id: user.id,
    created_at: new Date().toISOString(),
    atualizadoem: new Date().toISOString(),
  };

  await supabase.from(TABELA).insert(copia);
}
