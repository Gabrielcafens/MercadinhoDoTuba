import express from 'express';
import produtosController from '../controllers/produtosController.js';

const router = express.Router();

router.get('/', produtosController.getAllProdutos);
router.post('/', produtosController.createProduto);
router.get('/:id', produtosController.getProdutoById);
router.put('/:id', produtosController.updateProduto);
router.delete('/:id', produtosController.deleteProduto);

export default router;
