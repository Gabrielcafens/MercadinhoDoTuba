import Joi from 'joi';

const estoqueSchema = Joi.object({
    produto_id: Joi.number().integer().required().messages({
        'number.base': 'O Produto ID deve ser um número inteiro',
        'number.empty': 'O Produto ID é obrigatório',
    }),
    quantidade_atual: Joi.number().integer().min(0).required().messages({
        'number.base': 'A quantidade deve ser um número inteiro',
        'number.empty': 'A quantidade é obrigatória',
        'number.min': 'A quantidade não pode ser negativa',
    }),
});

export default estoqueSchema;
