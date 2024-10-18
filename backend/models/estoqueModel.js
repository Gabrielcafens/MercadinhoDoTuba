import pool from './config/db.js';

const getAllEstoque = async () => {
    const result = await pool.query('SELECT * FROM estoque');
    return result.rows;
};

const createEstoque = async ({ produto_id, quantidade_atual }) => {
    const result = await pool.query(
        'INSERT INTO estoque (produto_id, quantidade_atual) VALUES ($1, $2) RETURNING *',
        [produto_id, quantidade_atual]
    );
    return result.rows[0];
};

const getEstoqueById = async (id) => {
    const result = await pool.query('SELECT * FROM estoque WHERE id = $1', [id]);
    return result.rows[0];
};

const updateEstoque = async (id, { produto_id, quantidade_atual }) => {
    const result = await pool.query(
        'UPDATE estoque SET produto_id = $1, quantidade_atual = $2 WHERE id = $3 RETURNING *',
        [produto_id, quantidade_atual, id]
    );
    return result.rows[0];
};

const deleteEstoque = async (id) => {
    const result = await pool.query('DELETE FROM estoque WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

export default {
    getAllEstoque,
    createEstoque,
    getEstoqueById,
    updateEstoque,
    deleteEstoque,
};