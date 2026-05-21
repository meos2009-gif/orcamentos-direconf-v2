import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

console.log("URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function entrar(e) {
    e.preventDefault();
    setErro("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErro("Email ou password incorretos");
      return;
    }

    navigate("/"); // vai para o formulário principal
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "60px auto",
        padding: "30px",
        background: "#1e293b",
        borderRadius: "12px",
        color: "white",
        boxShadow: "0 0 20px rgba(0,0,0,0.4)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Entrar</h2>

      <form onSubmit={entrar}>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "6px",
            border: "1px solid #334155",
            background: "#0f172a",
            color: "white",
          }}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "6px",
            border: "1px solid #334155",
            background: "#0f172a",
            color: "white",
          }}
        />

        {erro && (
          <p style={{ color: "red", marginBottom: "10px" }}>{erro}</p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#facc15",
            color: "#000",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
