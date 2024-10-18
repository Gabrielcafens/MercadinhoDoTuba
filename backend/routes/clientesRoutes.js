import { Router } from 'express';
import clientesController from '../controllers/clientesController.js';

const router = Router();

router.get('/', clientesController.getAllClientes);
router.post('/', clientesController.createCliente);
router.get('/:id', clientesController.getClienteById);
router.put('/:id', clientesController.updateCliente);
router.delete('/:id', clientesController.deleteCliente);

export default router;
