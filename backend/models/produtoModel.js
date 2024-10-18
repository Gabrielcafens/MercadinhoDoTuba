import pool from '../config/db.js';

const getAllProdutos = async () => {
    const res = await pool.query('SELECT * FROM produtos');
    return res.rows;
};

const getProdutoById = async (id) => {
    const res = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);
    return res.rows[0];
};


const createProduto = async ({ nome, unidade, categoria_id, preco }) => {
    if (!nome || !unidade || !categoria_id || !preco) {
        throw new Error('Todos os campos são obrigatórios');
    }
    
    const res = await pool.query(
        'INSERT INTO produtos (nome, unidade, categoria_id, preco) VALUES ($1, $2, $3, $4) RETURNING *',
        [nome, unidade, categoria_id, preco]
    );
    return res.rows[0];
};

const updateProduto = async (id, { nome, unidade, categoria_id, preco }) => {
    const res = await pool.query(
        'UPDATE produtos SET nome = $1, unidade = $2, categoria_id = $3, preco = $4 WHERE id = $5 RETURNING *',
        [nome, unidade, categoria_id, preco, id]
    );
    return res.rows[0];
};

const deleteProduto = async (id) => {
    const res = await pool.query('DELETE FROM produtos WHERE id = $1', [id]);
    return res.rowCount;
};

export default {
    getAllProdutos,
    getProdutoById,
    createProduto,
    updateProduto,
    deleteProduto,
};
