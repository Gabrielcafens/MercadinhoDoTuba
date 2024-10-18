import { Router } from 'express';
import estoqueController from '../controllers/estoqueController.js';

const router = Router();

router.get('/', estoqueController.getAllEstoque);
router.post('/', estoqueController.createEstoque);
router.get('/:id', estoqueController.getEstoqueById);
router.put('/:id', estoqueController.updateEstoque);
router.delete('/:id', estoqueController.deleteEstoque);     

export default router;
