import { Router } from 'express';
import pool from '../config/db.js';
import clienteSchema from '../validations/clienteValidation.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM clientes');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar clientes');
    }
});

router.post('/', async (req, res) => {
    const { error } = clienteSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { nome, endereco, telefone } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO clientes (nome, endereco, telefone) VALUES ($1, $2, $3) RETURNING *',
            [nome, endereco, telefone]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao criar cliente');
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Cliente não encontrado');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar cliente');
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = clienteSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { nome, endereco, telefone } = req.body;

    try {
        const result = await pool.query(
            'UPDATE clientes SET nome = $1, endereco = $2, telefone = $3 WHERE id = $4 RETURNING *',
            [nome, endereco, telefone, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Cliente não encontrado');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao atualizar cliente');
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM clientes WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).send('Cliente não encontrado');
        }

        res.status(200).json({ message: 'Cliente excluído com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao deletar cliente');
    }
});

export default router;
