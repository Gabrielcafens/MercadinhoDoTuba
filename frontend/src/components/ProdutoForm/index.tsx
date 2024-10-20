import React, { useEffect, useState } from 'react';

interface Produto {
  id?: number;
  nome: string;
  unidade: string;
  quantidade: number;
  preco: number;
}

interface ProdutoFormProps {
  produto?: Produto;
  onClose: () => void;
  onSave: () => void;
}

const ProdutoForm: React.FC<ProdutoFormProps> = ({ produto, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    unidade: '',
    quantidade: 0,
    preco: 0,
  });

  useEffect(() => {
    if (produto) {
      setFormData(produto);
    }
  }, [produto]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (produto) {
      await fetch(`http://localhost:3000/produtos/${produto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } else {
      await fetch('http://localhost:3000/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    }
    onSave();
  };

  return (
    <div>
      <h2>{produto ? 'Editar Produto' : 'Adicionar Produto'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Nome"
          required
        />
        <input
          type="text"
          name="unidade"
          value={formData.unidade}
          onChange={handleChange}
          placeholder="Unidade"
          required
        />
        <input
          type="number"
          name="quantidade"
          value={formData.quantidade}
          onChange={handleChange}
          placeholder="Quantidade"
          required
        />
        <input
          type="number"
          name="preco"
          value={formData.preco}
          onChange={handleChange}
          placeholder="Preço"
          required
        />
        <button type="submit">{produto ? 'Atualizar' : 'Adicionar'}</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default ProdutoForm;
