import * as EquipesModel from '../Models/equipes.models.js';
import { buscarUsuarioPorNome } from '../Models/usuario.models.js';

export async function listar(req, res) {
    const equipes = await EquipesModel.listarEquipes();
    res.json(equipes);
}

export async function listar_detalhadas(req, res) {
    const equipes = await EquipesModel.listarEquipes_detalhadas();
    res.json(equipes);
}

export async function criar(req, res) {
    const { nome_equipe } = req.body;
    if (!nome_equipe) {
        return res.status(400).json({ msg: "Nome da equipe é obrigatório" });
    }
    const resultado = await EquipesModel.criarEquipe(nome_equipe);
    res.status(201).json({ msg: "Equipe criada com sucesso", id: resultado.insertId });
}

export async function deletar(req, res) {
    const resultado = await EquipesModel.deletarEquipe(req.params.id);
    if (resultado.affectedRows === 0) {
        return res.status(404).json({ msg: "Equipe não encontrada" });
    }
    res.json({ msg: "Equipe deletada com sucesso" });
}

export async function buscarPorId(req, res) {
    const equipe = await EquipesModel.buscarEquipePorId(req.params.id);
    if (!equipe) {
        return res.status(404).json({ msg: "Equipe não encontrada" });
    }
    res.json(equipe);
}

export async function adicionarPontos(req, res) {
    const { id } = req.params;
    const { p_disciplina, p_indisciplina, p_atraso, p_entrega, p_atitude } = req.body;
    const resultado = await EquipesModel.adicionarpontos(
        id,
        Number(p_disciplina)   || 0,
        Number(p_indisciplina) || 0,
        Number(p_atraso)       || 0,
        Number(p_entrega)      || 0,
        Number(p_atitude)      || 0
    );
    if (resultado.affectedRows === 0) {
        return res.status(404).json({ msg: "Equipe não encontrada" });
    }
    res.json({ msg: "Pontos adicionados com sucesso" });
}

export async function editar(req, res) {
    const { id } = req.params;
    const { nome_equipe } = req.body;
    const resultado = await EquipesModel.editarequipe(id, nome_equipe);
    if (resultado.affectedRows === 0) {
        return res.status(404).json({ msg: "Equipe não encontrada" });
    }
    res.json({ msg: "Equipe editada com sucesso" });
}

// ── MEMBROS ──

export async function listarMembros(req, res) {
    const { id } = req.params;
    const membros = await EquipesModel.listarMembrosEquipe(id);
    res.json(membros);
}

// Recebe array de nomes: { nomes: ["João", "Maria"] }
// Resolve o usuario_id pelo nome antes de inserir
export async function adicionarMembros(req, res) {
    const { equipe_id, nomes } = req.body;

    if (!equipe_id || !Array.isArray(nomes) || nomes.length === 0) {
        return res.status(400).json({ msg: "equipe_id e nomes[] são obrigatórios" });
    }

    const erros = [];
    for (const nome of nomes) {
        const usuario = await buscarUsuarioPorNome(nome);
        if (!usuario) {
            erros.push(nome);
            continue;
        }
        await EquipesModel.adicionarMembro(usuario.id, equipe_id);
    }

    if (erros.length > 0) {
        return res.status(207).json({
            msg: "Alguns membros não foram encontrados",
            nao_encontrados: erros,
        });
    }

    res.json({ msg: "Membros adicionados com sucesso" });
}

// Recebe array de usuario_ids: { equipe_id, usuario_ids: [1, 2] }
export async function removerMembros(req, res) {
    const { equipe_id, usuario_ids } = req.body;

    if (!equipe_id || !Array.isArray(usuario_ids) || usuario_ids.length === 0) {
        return res.status(400).json({ msg: "equipe_id e usuario_ids[] são obrigatórios" });
    }

    for (const usuario_id of usuario_ids) {
        await EquipesModel.removerMembro(usuario_id, equipe_id);
    }

    res.json({ msg: "Membros removidos com sucesso" });
}