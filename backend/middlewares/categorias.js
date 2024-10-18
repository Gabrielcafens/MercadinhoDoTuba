import { Router } from 'express';
import pool from '../config/db.js';
import categoriaSchema from '../validations/categoriaValidation.js';
import Joi from 'joi'; // Certifique-se de que está importando o Joi

const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categorias');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar categorias');
    }
});

router.post('/', async (req, res) => {
    // Validação de dados de entrada usando o Joi
    const { error } = categoriaSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { nome } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO categorias (nome) VALUES ($1) RETURNING *',
            [nome]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao criar categoria');
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    // Validação do ID usando Joi
    const idValidation = Joi.number().integer().required();
    const { error: idError } = idValidation.validate(id);
    if (idError) {
        return res.status(400).send('ID deve ser um número inteiro');
    }

    try {
        const result = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Categoria não encontrada');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar categoria');
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;

    // Validação do ID usando Joi
    const idValidation = Joi.number().integer().required();
    const { error: idError } = idValidation.validate(id);
    if (idError) {
        return res.status(400).send('ID deve ser um número inteiro');
    }

    // Validação de dados de entrada usando o Joi
    const { error } = categoriaSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { nome } = req.body;

    try {
        const result = await pool.query(
            'UPDATE categorias SET nome = $1 WHERE id = $2 RETURNING *',
            [nome, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Categoria não encontrada');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao atualizar categoria');
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
        const result = await pool.query('DELETE FROM categorias WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).send('Categoria não encontrada');
        }

        res.status(200).json({ message: 'Categoria excluída com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao deletar categoria');
    }
});

export default router;
