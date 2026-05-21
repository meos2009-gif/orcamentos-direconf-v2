import { useState, useEffect } from "react";

export default function CalculoTecido({ onChange, titulo }) {
  const [kg, setKg] = useState(0);
  const [precoKg, setPrecoKg] = useState(0);

  const custo = (kg * precoKg).toFixed(2);

  useEffect(() => {
    onChange(Number(custo));
  }, [kg, precoKg, custo, onChange]);

  return (
    <div className="fp-card">
      <label>{titulo}</label>

      <label>Kg</label>
      <input
        type="number"
        value={kg}
        onChange={(e) => setKg(Number(e.target.value))}
      />

      <label>Preço por Kg (€)</label>
      <input
        type="number"
        value={precoKg}
        onChange={(e) => setPrecoKg(Number(e.target.value))}
      />

      <div style={{ marginTop: 6, fontWeight: 600, fontSize: 14 }}>
        Custo: {custo} €
      </div>
    </div>
  );
}
