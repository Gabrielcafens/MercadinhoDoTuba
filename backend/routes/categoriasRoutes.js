import { Router } from 'express';
import categoriasController from '../controllers/categoriasController.js';

const router = Router();

router.get('/', categoriasController.getAllCategorias);
router.post('/', categoriasController.createCategoria);
router.get('/:id', categoriasController.getCategoriaById);
router.put('/:id', categoriasController.updateCategoria);
router.delete('/:id', categoriasController.deleteCategoria);

export default router;
