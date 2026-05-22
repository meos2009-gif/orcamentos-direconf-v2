// src/state/precos.js

// 🔹 Obter todas as fichas guardadas
export function getTodasFichas() {
  return JSON.parse(localStorage.getItem("fichas") || "[]");
}

// 🔹 Guardar lista completa
function guardarFichas(lista) {
  localStorage.setItem("fichas", JSON.stringify(lista));
}

// 🔹 Obter ficha por ID
export function getFichaPorId(id) {
  const fichas = getTodasFichas();
  return fichas.find(f => f.id == id); // == para aceitar string ou número
}

// 🔹 Apagar ficha
export function apagarFicha(id) {
  const fichas = getTodasFichas();
  const novas = fichas.filter(f => f.id != id);
  guardarFichas(novas);
}

// 🔹 Duplicar ficha
export function duplicarFicha(id) {
  const fichas = getTodasFichas();
  const original = fichas.find(f => f.id == id);
  if (!original) return;

  const copia = {
    ...original,
    id: Date.now(), // novo ID
    referencia: original.referencia + "_COPIA"
  };

  fichas.push(copia);
  guardarFichas(fichas);
}

// 🔹 Criar ou atualizar ficha
export function guardarFicha(ficha) {
  const fichas = getTodasFichas();

  // Atualizar ficha existente
  if (ficha.id) {
    const index = fichas.findIndex(f => f.id == ficha.id);
    if (index !== -1) {
      fichas[index] = ficha;
      guardarFichas(fichas);
      return;
    }
  }

  // Criar nova ficha
  ficha.id = Date.now();
  fichas.push(ficha);
  guardarFichas(fichas);
}
