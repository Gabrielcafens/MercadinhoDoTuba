import pool from './config/db.js';

const getCategorias = async () => {
    const result = await pool.query('SELECT * FROM categorias');
    return result.rows;
};

const createCategoria = async ({ nome }) => {
    if (!nome) {
        throw new Error('O nome da categoria é obrigatório');
    }
    const result = await pool.query(
        'INSERT INTO categorias (nome) VALUES ($1) RETURNING *',
        [nome]
    );
    return result.rows[0];
};

const updateCategoria = async (id, { nome }) => {
    if (!nome) {
        throw new Error('O nome da categoria é obrigatório');
    }
    const result = await pool.query(
        'UPDATE categorias SET nome = $1 WHERE id = $2 RETURNING *',
        [nome, id]
    );

    if (result.rowCount === 0) {
        throw new Error('Categoria não encontrada');
    }
    return result.rows[0];
};

const deleteCategoria = async (id) => {
    const result = await pool.query('DELETE FROM categorias WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
        throw new Error('Categoria não encontrada');
    }
    return { message: 'Categoria excluída com sucesso' };
};

export default {
    getCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
};
