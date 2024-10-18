import { Router } from 'express';
import pool from '../config/db.js';
import itensPedidoSchema from '../validations/itensPedidoValidation.js';
import Joi from 'joi';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM itens_pedido');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar itens do pedido');
    }
});

router.post('/', async (req, res) => {
    const { error } = itensPedidoSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { pedido_id, produto_id, quantidade } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade) VALUES ($1, $2, $3) RETURNING *',
            [pedido_id, produto_id, quantidade]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao adicionar item ao pedido');
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;


    const idValidation = Joi.number().integer().required();
    const { error: idError } = idValidation.validate(id);
    if (idError) {
        return res.status(400).send('ID deve ser um número inteiro');
    }

    try {
        const result = await pool.query('SELECT * FROM itens_pedido WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Item do pedido não encontrado');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar item do pedido');
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;


    const idValidation = Joi.number().integer().required();
    const { error: idError } = idValidation.validate(id);
    if (idError) {
        return res.status(400).send('ID deve ser um número inteiro');
    }

    const { error } = itensPedidoSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { pedido_id, produto_id, quantidade } = req.body;

    try {
        const result = await pool.query(
            'UPDATE itens_pedido SET pedido_id = $1, produto_id = $2, quantidade = $3 WHERE id = $4 RETURNING *',
            [pedido_id, produto_id, quantidade, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Item do pedido não encontrado');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao atualizar item do pedido');
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const idValidation = Joi.number().integer().required();
    const { error: idError } = idValidation.validate(id);
    if (idError) {
        return res.status(400).send('ID deve ser um número inteiro');
    }

    try {
        const result = await pool.query('DELETE FROM itens_pedido WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).send('Item do pedido não encontrado');
        }

        res.status(200).json({ message: 'Item do pedido excluído com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao deletar item do pedido');
    }
});

export default router;
