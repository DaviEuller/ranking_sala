import { api } from "./api";

export async function listarEquipes() {
  const { data } = await api.get("/equipes");
  return data;
}

export async function listarEquipesDetalhadas() {
  const { data } = await api.get("/equipes/detalhadas");
  return data;
}

export async function criarEquipe(payload) {
  const { data } = await api.post("/equipes", payload);
  return data;
}

export async function deletarEquipe(id) {
    const { data } = await api.delete(`/equipes/${id}`);
    return data;
}

export async function adicionarPontos(id, payload) {
    const { data } = await api.post(`/equipes/${id}/pontos`, payload);
    return data;
}

export async function editarEquipe(id, payload) {
    const { data } = await api.put(`/equipes/${id}`, payload);
    return data;
}

export async function adicionarMembros(payload) {
    const { data } = await api.post(`/equipes/membros`, payload);
    return data;
}

export async function removerMembros(payload) {
    const { data } = await api.delete(`/equipes/membros`, { data: payload });
    return data;
}