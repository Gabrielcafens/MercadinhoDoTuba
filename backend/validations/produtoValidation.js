import Joi from 'joi';

const produtoSchema = Joi.object({
    nome: Joi.string().required().min(3).max(100).messages({
        'string.base': 'O nome deve ser um texto',
        'string.empty': 'O nome é obrigatório',
        'string.min': 'O nome deve ter pelo menos 3 caracteres',
        'string.max': 'O nome deve ter no máximo 100 caracteres',
    }),
    preco: Joi.number().required().min(0).messages({
        'number.base': 'O preço deve ser um número',
        'number.empty': 'O preço é obrigatório',
        'number.min': 'O preço deve ser maior ou igual a 0',
    }),
    categoria_id: Joi.number().integer().required().messages({
        'number.base': 'O categoria_id deve ser um número inteiro',
        'number.empty': 'O categoria_id é obrigatório',
    }),
    estoque: Joi.number().required().min(0).messages({
        'number.base': 'O estoque deve ser um número',
        'number.empty': 'O estoque é obrigatório',
        'number.min': 'O estoque deve ser maior ou igual a 0',
    }),
});

export default produtoSchema;
