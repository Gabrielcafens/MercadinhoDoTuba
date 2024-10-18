import pool from './config/db.js';

const getAllPedidos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pedidos');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar pedidos.' });
    }
};

const createPedido = async (req, res) => {
    const { cliente_id, data_pedido, status } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO pedidos (cliente_id, data_pedido, status) VALUES ($1, $2, $3) RETURNING *',
            [cliente_id, data_pedido, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar pedido.' });
    }
};

const getPedidoById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM pedidos WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar pedido.' });
    }
};

const updatePedido = async (req, res) => {
    const { id } = req.params;
    const { cliente_id, data_pedido, status } = req.body;

    try {
        const result = await pool.query(
            'UPDATE pedidos SET cliente_id = $1, data_pedido = $2, status = $3 WHERE id = $4 RETURNING *',
            [cliente_id, data_pedido, status, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar pedido.' });
    }
};

const deletePedido = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM pedidos WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }

        res.status(200).json({ message: 'Pedido excluído com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar pedido.' });
    }
};

export default {
    getAllPedidos,
    createPedido,
    getPedidoById,
    updatePedido,
    deletePedido,
};
