import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Navigate } from "react-router-dom";

export default function RotaProtegida({ children }) {
  const [carregar, setCarregar] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function verificarSessao() {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setCarregar(false);
    }

    verificarSessao();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      verificarSessao();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (carregar) return <p style={{ color: "white" }}>A carregar...</p>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
