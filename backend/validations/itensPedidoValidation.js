import Joi from 'joi';

const itensPedidoSchema = Joi.object({
    pedido_id: Joi.number().integer().required().messages({
        'number.base': 'O ID do pedido deve ser um número',
        'any.required': 'O ID do pedido é obrigatório',
    }),
    produto_id: Joi.number().integer().required().messages({
        'number.base': 'O ID do produto deve ser um número',
        'any.required': 'O ID do produto é obrigatório',
    }),
    quantidade: Joi.number().integer().min(1).required().messages({
        'number.base': 'A quantidade deve ser um número',
        'number.min': 'A quantidade deve ser no mínimo 1',
        'any.required': 'A quantidade é obrigatória',
    }),
});

export default itensPedidoSchema;
