import { Router } from "express";
import * as usuarioController from "../Controllers/usuario.Controllers.js";

const router = Router();

router.get('/', usuarioController.listar);
router.get('/:id', usuarioController.buscarPorId);
router.post('/', usuarioController.criar);
router.post('/login', usuarioController.login);
router.delete('/:id', usuarioController.deletar);
router.put('/:id', usuarioController.atualizar);

export default router;