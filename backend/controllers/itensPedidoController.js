import itensPedidoModel from '../models/itensPedidoModel.js';

const getAllItensPedido = async (req, res) => {
    try {
        const itensPedido = await itensPedidoModel.getAllItensPedido();
        res.json(itensPedido);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar itens de pedido.' });
    }
};

const createItemPedido = async (req, res) => {
    const { pedido_id, produto_id, quantidade } = req.body;
    try {
        const novoItem = await itensPedidoModel.createItemPedido({ pedido_id, produto_id, quantidade });
        res.status(201).json(novoItem);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar item de pedido.' });
    }
};

const getItemPedidoById = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await itensPedidoModel.getItemPedidoById(id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ error: 'Item de pedido não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar item de pedido.' });
    }
};

const updateItemPedido = async (req, res) => {
    const { id } = req.params;
    const { pedido_id, produto_id, quantidade } = req.body;
    try {
        const itemAtualizado = await itensPedidoModel.updateItemPedido(id, { pedido_id, produto_id, quantidade });
        if (itemAtualizado) {
            res.json(itemAtualizado);
        } else {
            res.status(404).json({ error: 'Item de pedido não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar item de pedido.' });
    }
};

const deleteItemPedido = async (req, res) => {
    const { id } = req.params;
    try {
        const itemDeletado = await itensPedidoModel.deleteItemPedido(id);
        if (itemDeletado) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Item de pedido não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar item de pedido.' });
    }
};

export default {
    getAllItensPedido,
    createItemPedido,
    getItemPedidoById,
    updateItemPedido,
    deleteItemPedido,
};
