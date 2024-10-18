import Joi from 'joi';

const categoriaSchema = Joi.object({
    nome: Joi.string().required().min(3).max(50).messages({
        'string.base': 'O nome deve ser um texto',
        'string.empty': 'O nome é obrigatório',
        'string.min': 'O nome deve ter pelo menos 3 caracteres',
        'string.max': 'O nome deve ter no máximo 50 caracteres',
    }),
});

export default categoriaSchema;
