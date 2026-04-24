import  conexao  from "../config/db.js";

export async function listarUsuarios() {
    const [resultado] = await conexao.query(
        "SELECT id, nome, email, criado_em FROM usuario ORDER BY id DESC"
    );
    return resultado;
}

export async function buscarUsuarios(id) {
    const [resultado] = await conexao.query(
        "SELECT * FROM usuario WHERE id = ?",
        [id]
    );
    return resultado;
}

export async function criarUsuario(
  email, senha, numero_chamada, idade, empresa, numero_verificacao, tipo, equipe_id, nome
) {
  const [resultado] = await conexao.query(
    "INSERT INTO usuario (email, senha, numero_chamada, idade, empresa, numero_verificacao, tipo, equipe_id, nome) VALUES (?,?,?,?,?,?,?,?,?);",
    [email, senha, numero_chamada, idade, empresa, numero_verificacao, tipo, equipe_id, nome]
  );
  return resultado.insertId;
}

export async function buscarUsuariosPorEmail(email) {
    const [resultado] = await conexao.query(
        "SELECT id, email, tipo, nome, criado_em, senha FROM usuario WHERE email = ?",
        [email]
    );
    return resultado[0];
}

export async function deletarUsuario(id) {
    const [resultado] = await conexao.query(
        "DELETE FROM usuario WHERE id = ?",
        [id]
    );
    return resultado;
}

export async function atualizarUsuario(id, nome, email) {
    const [resultado] = await conexao.query(
        "UPDATE usuario SET nome = ?, email = ? WHERE id = ?",
        [nome, email, id]
    );
    return resultado;
}

// ── NOVO ──
export async function buscarUsuarioPorNome(nome) {
    const [resultado] = await conexao.query(
        "SELECT id, nome FROM usuario WHERE nome = ?",
        [nome]
    );
    return resultado[0]; // retorna undefined se não encontrar
}