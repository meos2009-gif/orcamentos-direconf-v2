import { supabase } from "../supabaseClient";

export async function getVariaveis() {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return [];

  const { data } = await supabase
    .from("variaveis")
    .select("*")
    .eq("user_id", user.id)
    .order("nome", { ascending: true });

  return data || [];
}

export async function guardarVariavel(nome) {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return;

  await supabase.from("variaveis").insert({
    nome,
    user_id: user.id,
  });
}

export async function apagarVariavel(id) {
  await supabase.from("variaveis").delete().eq("id", id);
}
