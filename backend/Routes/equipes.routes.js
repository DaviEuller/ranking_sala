import { Router } from "express";
import * as EquipesController from "../Controllers/equipes.controllers.js";

const router = Router();

router.get('/',                  EquipesController.listar);
router.get('/detalhadas',        EquipesController.listar_detalhadas);
router.get('/:id',               EquipesController.buscarPorId);          // ← novo
router.post('/',                 EquipesController.criar);
router.delete('/:id',            EquipesController.deletar);
router.post('/:id/pontos',       EquipesController.adicionarPontos);
router.put('/:id',               EquipesController.editar);
router.get('/:id/membros',       EquipesController.listarMembros);
router.post('/membros',          EquipesController.adicionarMembros);
router.delete('/membros',        EquipesController.removerMembros);

export default router;
