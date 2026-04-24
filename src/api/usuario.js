import { api } from "./api";

export async function loginUsuario(email, senha) {
  const { data } = await api.post("/usuarios/login", { email, senha });
  return data;
}

// Add other functions if needed
export async function listarUsuarios() {
  const { data } = await api.get("/usuarios");
  return data;
}

export async function criarUsuario(payload) {
  const { data } = await api.post("/usuarios", payload);
  return data;
}

export async function deletarUsuario(id) {
  const { data } = await api.delete(`/usuarios/${id}`);
  return data;
}