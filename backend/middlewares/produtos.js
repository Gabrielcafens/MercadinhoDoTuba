import { Router } from 'express';
import pool from '../config/db.js';
import produtoSchema from '../validations/produtoValidation.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM produtos');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar produtos');
    }
});

router.post('/', async (req, res) => {
    const { error } = produtoSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { nome, preco, categoria_id, estoque } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO produtos (nome, preco, categoria_id, estoque) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, preco, categoria_id, estoque]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao criar produto');
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Produto não encontrado');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar produto');
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = produtoSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { nome, preco, categoria_id, estoque } = req.body;

    try {
        const result = await pool.query(
            'UPDATE produtos SET nome = $1, preco = $2, categoria_id = $3, estoque = $4 WHERE id = $5 RETURNING *',
            [nome, preco, categoria_id, estoque, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Produto não encontrado');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao atualizar produto');
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM produtos WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).send('Produto não encontrado');
        }

        res.status(200).json({ message: 'Produto excluído com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao deletar produto');
    }
});

export default router;
