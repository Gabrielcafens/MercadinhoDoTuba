import { Router } from 'express';
import pedidosController from '../controllers/pedidosController.js';

const router = Router();

router.get('/', pedidosController.getAllPedidos);
router.post('/', pedidosController.createPedido);
router.get('/:id', pedidosController.getPedidoById);
router.put('/:id', pedidosController.updatePedido);
router.delete('/:id', pedidosController.deletePedido);

export default router;
