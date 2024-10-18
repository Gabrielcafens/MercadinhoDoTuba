import Joi from 'joi';

const clienteSchema = Joi.object({
    nome: Joi.string().required().min(3).max(100).messages({
        'string.base': 'O nome deve ser um texto',
        'string.empty': 'O nome é obrigatório',
        'string.min': 'O nome deve ter pelo menos 3 caracteres',
        'string.max': 'O nome deve ter no máximo 100 caracteres',
    }),
    endereco: Joi.string().required().min(5).max(255).messages({
        'string.base': 'O endereço deve ser um texto',
        'string.empty': 'O endereço é obrigatório',
        'string.min': 'O endereço deve ter pelo menos 5 caracteres',
        'string.max': 'O endereço deve ter no máximo 255 caracteres',
    }),
    telefone: Joi.string().required().pattern(/^[0-9]{10,15}$/).messages({
        'string.base': 'O telefone deve ser um texto',
        'string.empty': 'O telefone é obrigatório',
        'string.pattern.base': 'O telefone deve conter entre 10 e 15 dígitos',
    }),
});

export default clienteSchema;
