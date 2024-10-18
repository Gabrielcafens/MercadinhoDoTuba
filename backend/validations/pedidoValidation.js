import Joi from 'joi';

const pedidoSchema = Joi.object({
    cliente_id: Joi.number().integer().required().messages({
        'number.base': 'O ID do cliente deve ser um número',
        'any.required': 'O cliente_id é obrigatório',
    }),
    data_pedido: Joi.date().required().messages({
        'date.base': 'A data do pedido deve ser uma data válida',
        'any.required': 'A data_pedido é obrigatória',
    }),
    status: Joi.string().valid('pendente', 'entregue').required().messages({
        'string.base': 'O status deve ser um texto',
        'any.only': 'O status deve ser "pendente" ou "entregue"',
        'any.required': 'O status é obrigatório',
    }),
});

export default pedidoSchema;
