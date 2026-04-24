import conexao from "../config/db.js";

export async function listarEquipes() {
    const [resultado] = await conexao.query(
        "SELECT id, nome_equipe, total, status FROM Equipes ORDER BY id DESC"
    );
    return resultado;
}

export async function listarEquipes_detalhadas() {
    const [resultado] = await conexao.query(
        "SELECT * FROM Equipes ORDER BY id DESC"
    );
    return resultado;
}

export async function buscarEquipePorId(id) {
    const [rows] = await conexao.query(
        "SELECT * FROM Equipes WHERE id = ?",
        [id]
    );
    return rows[0];
}

export async function criarEquipe(nome_equipe) {
    const [resultado] = await conexao.query(
        "INSERT INTO Equipes (nome_equipe) VALUES (?)",
        [nome_equipe]
    );
    return resultado;
}

export async function deletarEquipe(id) {
    const [resultado] = await conexao.query(
        "DELETE FROM Equipes WHERE id = ?",
        [id]
    );
    return resultado;
}

export async function adicionarpontos(id, p_disciplina, p_indisciplina, p_atraso, p_entrega, p_atitude) {
    const pontos = p_disciplina + p_indisciplina + p_atraso + p_entrega + p_atitude;

    const [rows] = await conexao.query("SELECT total FROM Equipes WHERE id = ?", [id]);
    const totalAtual = rows[0]?.total ?? 0;
    const novoTotal = totalAtual + pontos;

    let status;
    if (novoTotal >= 30) status = 'verde';
    else if (novoTotal >= 15) status = 'amarelo';
    else status = 'vermelho';

    const [resultado] = await conexao.query(
        `UPDATE Equipes SET
            total             = total + ?,
            pontos_diciplina  = pontos_diciplina  + ?,
            pontos_indisplina = pontos_indisplina + ?,
            pontos_atraso     = pontos_atraso     + ?,
            pontos_entrega    = pontos_entrega    + ?,
            pontos_atitude    = pontos_atitude    + ?,
            status            = ?
         WHERE id = ?`,
        [pontos, p_disciplina, p_indisciplina, p_atraso, p_entrega, p_atitude, status, id]
    );
    return resultado;
}

export async function editarequipe(id, nome_equipe) {
    const [resultado] = await conexao.query(
        "UPDATE Equipes SET nome_equipe = ? WHERE id = ?",
        [nome_equipe, id]
    );
    return resultado;
}

export async function listarMembrosEquipe(equipe_id) {
    const [resultado] = await conexao.query(
        `SELECT u.id, u.nome
         FROM equipes_user eu
         JOIN usuario u ON u.id = eu.usuario_id
         WHERE eu.equipe_id = ?`,
        [equipe_id]
    );
    return resultado;
}

export async function adicionarMembro(usuario_id, equipe_id) {
    const [resultado] = await conexao.query(
        "INSERT INTO equipes_user (usuario_id, equipe_id) VALUES (?, ?)",
        [usuario_id, equipe_id]
    );
    return resultado;
}

export async function removerMembro(usuario_id, equipe_id) {
    const [resultado] = await conexao.query(
        "DELETE FROM equipes_user WHERE usuario_id = ? AND equipe_id = ?",
        [usuario_id, equipe_id]
    );
    return resultado;
}
