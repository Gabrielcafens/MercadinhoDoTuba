import { Router } from 'express';
import pool from '../config/db.js';
import pedidoSchema from '../validations/pedidoValidation.js';
import Joi from 'joi';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pedidos');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar pedidos');
    }
});

router.post('/', async (req, res) => {
    const { error } = pedidoSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { cliente_id, data_pedido, status } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO pedidos (cliente_id, data_pedido, status) VALUES ($1, $2, $3) RETURNING *',
            [cliente_id, data_pedido, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao criar pedido');
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
        const result = await pool.query('SELECT * FROM pedidos WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Pedido não encontrado');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar pedido');
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;

    const idValidation = Joi.number().integer().required();
    const { error: idError } = idValidation.validate(id);
    if (idError) {
        return res.status(400).send('ID deve ser um número inteiro');
    }

    const { error } = pedidoSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { cliente_id, data_pedido, status } = req.body;

    try {
        const result = await pool.query(
            'UPDATE pedidos SET cliente_id = $1, data_pedido = $2, status = $3 WHERE id = $4 RETURNING *',
            [cliente_id, data_pedido, status, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Pedido não encontrado');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao atualizar pedido');
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
        const result = await pool.query('DELETE FROM pedidos WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).send('Pedido não encontrado');
        }

        res.status(200).json({ message: 'Pedido excluído com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao deletar pedido');
    }
});

export default router;
