import express from 'express';
import cors from 'cors';
import categoriasRoutes from './middlewares/categorias.js';
import clientesRoutes from './middlewares/clientes.js';
import estoqueRoutes from './middlewares/estoque.js';
import itensPedidoRoutes from './middlewares/itensPedido.js'; 
import pedidosRoutes from './middlewares/pedidos.js';
import produtosRoutes from './middlewares/produtos.js';

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/categorias', categoriasRoutes);
app.use('/clientes', clientesRoutes);
app.use('/estoque', estoqueRoutes);
app.use('/itens_pedido', itensPedidoRoutes);
app.use('/pedidos', pedidosRoutes);
app.use('/produtos', produtosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
