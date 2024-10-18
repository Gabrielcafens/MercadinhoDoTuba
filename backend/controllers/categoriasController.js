import categoriaModel from '../models/categoriaModel.js';

const getAllCategorias = async (req, res) => {
    try {
        const categorias = await categoriaModel.getAllCategorias();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar categorias.' });
    }
};

const createCategoria = async (req, res) => {
    const { nome } = req.body;
    try {
        const novaCategoria = await categoriaModel.createCategoria({ nome });
        res.status(201).json(novaCategoria);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar categoria.' });
    }
};

const getCategoriaById = async (req, res) => {
    const { id } = req.params;
    try {
        const categoria = await categoriaModel.getCategoriaById(id);
        if (categoria) {
            res.json(categoria);
        } else {
            res.status(404).json({ error: 'Categoria não encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar categoria.' });
    }
};

const updateCategoria = async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    try {
        const categoriaAtualizada = await categoriaModel.updateCategoria(id, { nome });
        if (categoriaAtualizada) {
            res.json(categoriaAtualizada);
        } else {
            res.status(404).json({ error: 'Categoria não encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar categoria.' });
    }
};

const deleteCategoria = async (req, res) => {
    const { id } = req.params;
    try {
        const categoriaDeletada = await categoriaModel.deleteCategoria(id);
        if (categoriaDeletada) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Categoria não encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar categoria.' });
    }
};

export default {
    getAllCategorias,
    createCategoria,
    getCategoriaById,
    updateCategoria,
    deleteCategoria,
};
