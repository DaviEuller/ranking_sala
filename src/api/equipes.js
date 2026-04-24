import { api } from "./api";

export async function listarEquipes() {
  const { data } = await api.get("/equipes");
  return data;
}

export async function listarEquipesDetalhadas() {
  const { data } = await api.get("/equipes/detalhadas");
  return data;
}

export async function buscarEquipe(id) {
  const { data } = await api.get(`/equipes/${id}`);
  return data;
}

export async function criarEquipe(nome_equipe) {
  const { data } = await api.post("/equipes", { nome_equipe });
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

export async function listarMembros(equipe_id) {
  const { data } = await api.get(`/equipes/${equipe_id}/membros`);
  return data;
}

export async function adicionarMembros(equipe_id, nomes) {
  const { data } = await api.post(`/equipes/membros`, { equipe_id, nomes });
  return data;
}

export async function removerMembros(equipe_id, usuario_ids) {
  const { data } = await api.delete(`/equipes/membros`, {
    data: { equipe_id, usuario_ids },
  });
  return data;
}
