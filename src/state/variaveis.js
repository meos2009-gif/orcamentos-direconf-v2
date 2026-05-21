// Guardar variáveis no localStorage
export function getVariaveis() {
  return JSON.parse(localStorage.getItem("variaveis") || "[]");
}

export function adicionarVariavel(nome) {
  const variaveis = getVariaveis();

  const nova = {
    id: Date.now(),
    nome,
  };

  variaveis.push(nova);
  localStorage.setItem("variaveis", JSON.stringify(variaveis));
}

export function apagarVariavel(id) {
  const variaveis = getVariaveis().filter((v) => v.id !== id);
  localStorage.setItem("variaveis", JSON.stringify(variaveis));
}
