import estoqueModel from '../models/estoqueModel.js';

const getAllEstoque = async (req, res) => {
    try {
        const estoque = await estoqueModel.getAllEstoque();
        res.json(estoque);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estoque.' });
    }
};

const createEstoque = async (req, res) => {
    const { produto_id, quantidade_atual } = req.body;
    try {
        const novoEstoque = await estoqueModel.createEstoque({ produto_id, quantidade_atual });
        res.status(201).json(novoEstoque);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar estoque.' });
    }
};

const getEstoqueById = async (req, res) => {
    const { id } = req.params;
    try {
        const estoque = await estoqueModel.getEstoqueById(id);
        if (estoque) {
            res.json(estoque);
        } else {
            res.status(404).json({ error: 'Estoque não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estoque.' });
    }
};

const updateEstoque = async (req, res) => {
    const { id } = req.params;
    const { produto_id, quantidade_atual } = req.body;
    try {
        const estoqueAtualizado = await estoqueModel.updateEstoque(id, { produto_id, quantidade_atual });
        if (estoqueAtualizado) {
            res.json(estoqueAtualizado);
        } else {
            res.status(404).json({ error: 'Estoque não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar estoque.' });
    }
};

const deleteEstoque = async (req, res) => {
    const { id } = req.params;
    try {
        const estoqueDeletado = await estoqueModel.deleteEstoque(id);
        if (estoqueDeletado) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Estoque não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar estoque.' });
    }
};

export default {
    getAllEstoque,
    createEstoque,
    getEstoqueById,
    updateEstoque,
    deleteEstoque,
};
