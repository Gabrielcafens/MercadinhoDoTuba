import pool from '../config/db.js';

const getAllItensPedido = async () => {
    const result = await pool.query('SELECT * FROM itens_pedido');
    return result.rows;
};

const createItemPedido = async ({ pedido_id, produto_id, quantidade }) => {
    const result = await pool.query(
        'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade) VALUES ($1, $2, $3) RETURNING *',
        [pedido_id, produto_id, quantidade]
    );
    return result.rows[0];
};

const getItemPedidoById = async (id) => {
    const result = await pool.query('SELECT * FROM itens_pedido WHERE id = $1', [id]);
    return result.rows[0];
};

const updateItemPedido = async (id, { pedido_id, produto_id, quantidade }) => {
    const result = await pool.query(
        'UPDATE itens_pedido SET pedido_id = $1, produto_id = $2, quantidade = $3 WHERE id = $4 RETURNING *',
        [pedido_id, produto_id, quantidade, id]
    );
    return result.rows[0];
};

const deleteItemPedido = async (id) => {
    const result = await pool.query('DELETE FROM itens_pedido WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
};

export default {
    getAllItensPedido,
    createItemPedido,
    getItemPedidoById,
    updateItemPedido,
    deleteItemPedido,
};
