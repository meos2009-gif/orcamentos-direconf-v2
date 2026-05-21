import { supabase } from "../supabaseClient";

export async function criarCliente({ nome, telefone, email }) {
  const { data: { user } } = await supabase.auth.getUser();

  return await supabase
    .from("clientes")
    .insert({
      nome,
      telefone,
      email,
      user_id: user.id
    });
}

export async function listarClientes() {
  const { data: { user } } = await supabase.auth.getUser();

  return await supabase
    .from("clientes")
    .select("*")
    .eq("user_id", user.id)
    .order("nome", { ascending: true });
}

export async function apagarCliente(id) {
  const { data: { user } } = await supabase.auth.getUser();

  return await supabase
    .from("clientes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
}
