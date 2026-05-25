import { supabase } from "../supabaseClient";

export async function listarClientes() {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return { data: [] };

  const { data } = await supabase
    .from("clientes")
    .select("*")
    .eq("user_id", user.id)
    .order("nome", { ascending: true });

  return { data };
}

export async function guardarCliente(nome) {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return;

  await supabase.from("clientes").insert({
    nome,
    user_id: user.id,
  });
}

export async function apagarCliente(id) {
  await supabase.from("clientes").delete().eq("id", id);
}
