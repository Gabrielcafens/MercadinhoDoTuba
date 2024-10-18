import pool from '../config/db.js';

const getAllPedidos = async () => {
    const res = await pool.query('SELECT * FROM pedidos'); 
    return res.rows;
};

const createPedido = async ({ cliente_id, produto_id, quantidade, data }) => {
    const res = await pool.query(
        'INSERT INTO pedidos (cliente_id, produto_id, quantidade, data) VALUES ($1, $2, $3, $4) RETURNING *',
        [cliente_id, produto_id, quantidade, data]
    );
    return res.rows[0];
};

const updatePedido = async (id, { cliente_id, produto_id, quantidade, data }) => {
    const res = await pool.query(
        'UPDATE pedidos SET cliente_id = $1, produto_id = $2, quantidade = $3, data = $4 WHERE id = $5 RETURNING *',
        [cliente_id, produto_id, quantidade, data, id]
    );
    if (res.rows.length === 0) {
        throw new Error('Pedido não encontrado');
    }
    return res.rows[0];
};

const deletePedido = async (id) => {
    const res = await pool.query(
        'DELETE FROM pedidos WHERE id = $1 RETURNING *',
        [id]
    );
    if (res.rowCount === 0) {
        throw new Error('Pedido não encontrado');
    }
    return res.rows[0];
};

export default {
    getAllPedidos,
    createPedido,
    updatePedido,
    deletePedido,
};
