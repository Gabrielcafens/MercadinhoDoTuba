import clienteModel from '../models/clienteModel.js';

const getAllClientes = async (req, res) => {
    try {
        const clientes = await clienteModel.getAllClientes();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar clientes.' });
    }
};

const createCliente = async (req, res) => {
    const { nome, endereco, telefone } = req.body;
    try {
        const novoCliente = await clienteModel.createCliente({ nome, endereco, telefone });
        res.status(201).json(novoCliente);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar cliente.' });
    }
};

const getClienteById = async (req, res) => {
    const { id } = req.params;
    try {
        const cliente = await clienteModel.getClienteById(id);
        if (cliente) {
            res.json(cliente);
        } else {
            res.status(404).json({ error: 'Cliente não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar cliente.' });
    }
};

const updateCliente = async (req, res) => {
    const { id } = req.params;
    const { nome, endereco, telefone } = req.body;
    try {
        const clienteAtualizado = await clienteModel.updateCliente(id, { nome, endereco, telefone });
        if (clienteAtualizado) {
            res.json(clienteAtualizado);
        } else {
            res.status(404).json({ error: 'Cliente não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar cliente.' });
    }
};

const deleteCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const clienteDeletado = await clienteModel.deleteCliente(id);
        if (clienteDeletado) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Cliente não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar cliente.' });
    }
};

export default {
    getAllClientes,
    createCliente,
    getClienteById,
    updateCliente,
    deleteCliente,
};
