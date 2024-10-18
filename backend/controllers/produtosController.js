import produtoModel from '../models/produtoModel.js';

const getAllProdutos = async (req, res) => {
    try {
        const produtos = await produtoModel.getAllProdutos();
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
};

const getProdutoById = async (req, res) => {
    const { id } = req.params;
    try {
        const produto = await produtoModel.getProdutoById(id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }
        res.json(produto);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produto.' });
    }
};

const createProduto = async (req, res) => {
    const { nome, unidade, categoria_id, preco } = req.body;
    try {
        const novoProduto = await produtoModel.createProduto({ nome, unidade, categoria_id, preco });
        res.status(201).json(novoProduto);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar produto.' });
    }
};

const updateProduto = async (req, res) => {
    const { id } = req.params;
    const { nome, unidade, categoria_id, preco } = req.body;
    try {
        const produtoAtualizado = await produtoModel.updateProduto(id, { nome, unidade, categoria_id, preco });
        if (!produtoAtualizado) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }
        res.json(produtoAtualizado);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar produto.' });
    }
};

const deleteProduto = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await produtoModel.deleteProduto(id);
        if (result === 0) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }
        res.status(200).json({ message: 'Produto excluído com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar produto.' });
    }
};

export default {
    getAllProdutos,
    getProdutoById,
    createProduto,
    updateProduto,
    deleteProduto,
};
