import { supabase } from "../supabaseClient";

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
    descricao: dados.descricaoTecido || "",
    valor: dados.precoFinal || 0,          // preço final calculado
    precocliente: dados.precoCliente || 0, // preço cliente
    user_id: user.id,
  };

  const { error } = await supabase.from("fichas_preco").insert(ficha);

  if (error) {
    console.error("Erro ao guardar ficha:", error);
  }
}

export async function apagarFicha(cliente) {
  const { error } = await supabase
    .from("fichas_preco")
    .delete()
    .eq("nome_cliente", cliente);

  if (error) {
    console.error("Erro ao apagar ficha:", error);
  }
}

export async function duplicarFicha(cliente) {
  const ficha = await getFichaCliente(cliente);
  if (!ficha) return;

  const nova = {
    ...ficha,
    id: undefined,
    nome_cliente: ficha.nome_cliente + " (cópia)",
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("fichas_preco").insert(nova);

  if (error) {
    console.error("Erro ao duplicar ficha:", error);
  }
}
