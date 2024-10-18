import { Router } from 'express';
import pool from '../config/db.js';
import estoqueSchema from '../validations/estoqueValidation.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM estoque');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar itens do estoque');
    }
});

const validateEstoque = (req, res, next) => {
    const { error } = estoqueSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

router.post('/', validateEstoque, async (req, res) => {
    const { produto_id, quantidade_atual } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO estoque (produto_id, quantidade_atual) VALUES ($1, $2) RETURNING *',
            [produto_id, quantidade_atual]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao adicionar item ao estoque');
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM estoque WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Item do estoque não encontrado');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar item do estoque');
    }
});

router.put('/:id', validateEstoque, async (req, res) => {
    const { id } = req.params;
    const { produto_id, quantidade_atual } = req.body;

    try {
        const result = await pool.query(
            'UPDATE estoque SET produto_id = $1, quantidade_atual = $2 WHERE id = $3 RETURNING *',
            [produto_id, quantidade_atual, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Item do estoque não encontrado');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao atualizar item do estoque');
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM estoque WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).send('Item do estoque não encontrado');
        }

        res.status(200).json({ message: 'Item do estoque excluído com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao deletar item do estoque');
    }
});

export default router;
