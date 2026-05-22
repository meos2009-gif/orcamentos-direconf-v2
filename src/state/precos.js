export async function getTodasFichas() {
  // 1) Tentar obter o utilizador
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  let query = supabase.from("fichas_preco").select("*");

  // 2) Se o user existir → filtra por user_id
  if (user) {
    query = query.eq("user_id", user.id);
  }

  // 3) Ordenar
  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar fichas:", error);
    return [];
  }

  return data || [];
}
