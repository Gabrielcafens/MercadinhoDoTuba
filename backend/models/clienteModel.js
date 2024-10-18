import pool from '../config/db.js';

const getAllClientes = async () => {
    const res = await pool.query('SELECT * FROM clientes'); 
    return res.rows;
};

const createCliente = async ({ nome, endereco, telefone }) => {
    const res = await pool.query(
        'INSERT INTO clientes (nome, endereco, telefone) VALUES ($1, $2, $3) RETURNING *',
        [nome, endereco, telefone]
    );
    return res.rows[0];
};

const updateCliente = async (id, { nome, endereco, telefone }) => {
  const res = await pool.query(
      'UPDATE clientes SET nome = $1, endereco = $2, telefone = $3 WHERE id = $4 RETURNING *',
      [nome, endereco, telefone, id]
  );
  if (res.rows.length === 0) {
      throw new Error('Cliente não encontrado');
  }
  return res.rows[0];
};

const deleteCliente = async (id) => {
  const res = await pool.query(
      'DELETE FROM clientes WHERE id = $1 RETURNING *',
      [id]
  );
  if (res.rowCount === 0) {
      throw new Error('Cliente não encontrado');
  }
  return res.rows[0];
};

export default {
  getAllClientes,
  createCliente,
  updateCliente,
  deleteCliente,
};
