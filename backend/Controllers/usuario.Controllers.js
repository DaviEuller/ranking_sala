import * as usuarioModel from '../Models/usuario.models.js';
import crypto from 'crypto';

export async function listar(req, res) {
    const usuarios = await usuarioModel.listarUsuarios();
    res.json(usuarios);
}

export async function buscarPorId(req, res) {
    const resultado = await usuarioModel.buscarUsuarios(req.params.id);
    const usuario = resultado && resultado[0];

    if (!usuario) {
        return res.status(404).json({ msg: "Usuario não encontrado" });
    }

    res.json(usuario);
}

export async function criar(req, res) {
  try {
    const { email, senha, numero_chamada, idade, empresa, numero_verificacao, tipo, equipe_id, nome} = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ msg: "Nome, email e senha são obrigatórios" });
    }

    const senha_hash = crypto
      .createHash('sha256')
      .update(senha)
      .digest('hex');

    const id = await usuarioModel.criarUsuario(
        email, senha, numero_chamada, idade, empresa, numero_verificacao, tipo, equipe_id, nome
    );

    return res.status(201).json({
      msg: "Usuario criado com sucesso",
      id
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Erro ao criar usuário" });
  }
}

export async function login(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ msg: "Email e senha são obrigatórios" });
        }

        const usuario = await usuarioModel.buscarUsuariosPorEmail(email);

        if (!usuario) {
            return res.status(404).json({ msg: "Credenciais inválidas" });
        }

        const senha_hash = crypto
            .createHash('sha256')
            .update(senha)
            .digest('hex');

        if (senha !== usuario.senha) {
            return res.status(401).json({ msg: "Credenciais inválidas" });
        }

        const token = crypto.randomBytes(24).toString('hex');

        return res.status(200).json({
            msg: "Login bem sucedido",
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo
            }
        });

    } catch (error) {
        console.error("ERRO COMPLETO:", error.message, error.code);
        return res.status(500).json({ msg: "Erro interno" });
    }
}

export async function deletar(req, res) {
    const resultado = await usuarioModel.buscarUsuarios(req.params.id);
    const usuario = resultado && resultado[0];

    if (!usuario) {
        return res.status(404).json({ msg: "Usuario não encontrado" });
    }

    await usuarioModel.deletarUsuario(req.params.id);
    return res.status(200).json({ msg: "Usuario removido" });
}

export async function atualizar(req, res) {
    const resultado = await usuarioModel.buscarUsuarios(req.params.id);
    const usuario = resultado && resultado[0];
    if (!usuario) {
        return res.status(404).json({ msg: "Usuario não encontrado" });
    }
    const { nome, email } = req.body;
    if (!nome || !email) {
        return res.status(400).json({ msg: "Nome e email são obrigatórios" });
    }
    await usuarioModel.atualizarUsuario(req.params.id, nome, email);
    return res.status(200).json({ msg: "Usuario atualizado" });
};