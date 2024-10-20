import React, { useEffect, useState } from 'react';

interface EstoqueFormProps {
  estoque?: { id: number; produto_id: number; quantidade_atual: number };
  produtos: { id: number; nome: string }[];
  onClose: () => void;
  onSave: () => void;
}

const EstoqueForm: React.FC<EstoqueFormProps> = ({ estoque, produtos, onClose, onSave }) => {
  const [formData, setFormData] = useState<{
    produto_id: number | string;
    quantidade_atual: number;
  }>({
    produto_id: '',
    quantidade_atual: 0,
  });

  useEffect(() => {
    if (estoque) {
      setFormData({
        produto_id: estoque.produto_id,
        quantidade_atual: estoque.quantidade_atual,
      });
    }
  }, [estoque]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'quantidade_atual' ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const method = estoque ? 'PUT' : 'POST';
      const url = estoque ? `http://localhost:3000/estoque/${estoque.id}` : 'http://localhost:3000/estoque';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar o estoque');
      }

      onSave();
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>{estoque ? 'Editar Estoque' : 'Adicionar Estoque'}</h2>
      <form onSubmit={handleSubmit}>
        <select
          name="produto_id"
          value={formData.produto_id}
          onChange={handleChange}
          required
        >
          <option value="">Selecionar Produto</option>
          {produtos.map(produto => (
            <option key={produto.id} value={produto.id}>{produto.nome}</option>
          ))}
        </select>
        <input
          type="number"
          name="quantidade_atual"
          value={formData.quantidade_atual}
          onChange={handleChange}
          placeholder="Quantidade Atual"
          required
        />
        <button type="submit">{estoque ? 'Atualizar' : 'Adicionar'}</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default EstoqueForm;
