import { Router } from 'express';
import itensPedidoController from '../controllers/itensPedidoController.js';

const router = Router();

router.get('/', itensPedidoController.getAllItensPedido);
router.post('/', itensPedidoController.createItemPedido);
router.get('/:id', itensPedidoController.getItemPedidoById);
router.put('/:id', itensPedidoController.updateItemPedido);
router.delete('/:id', itensPedidoController.deleteItemPedido);

export default router;
