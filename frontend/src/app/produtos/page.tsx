/*'use client';

import ProdutoForm from '@/components/ProdutoForm';
import React, { useEffect, useState } from 'react';

interface Produto {
  id: number;
  nome: string;
  unidade: string;
  quantidade: number;
  preco: number;
}

const ProdutosPage = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

  const fetchProdutos = async () => {
    const response = await fetch('http://localhost:3000/produtos');
    const data = await response.json();
    setProdutos(data);
  };

  const handleAddProduto = () => {
    setProdutoSelecionado(null);
    setIsFormVisible(true);
  };

const handleEditProduto = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setIsFormVisible(true);
};

  const handleDeleteProduto = async (id: number) => {
    await fetch(`http://localhost:3000/produtos/${id}`, { method: 'DELETE' });
    fetchProdutos();
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  return (
    <div>
      <h1>Produtos</h1>
      <button onClick={handleAddProduto}>Adicionar Produto</button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Unidade</th>
            <th>Quantidade</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.id}</td>
              <td>{produto.nome}</td>
              <td>{produto.unidade}</td>
              <td>{produto.quantidade}</td>
              <td>{produto.preco}</td>
              <td>
                <button onClick={() => handleEditProduto(produto)}>Editar</button>
                <button onClick={() => handleDeleteProduto(produto.id)}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isFormVisible && (
        <ProdutoForm
          produto={produtoSelecionado ?? undefined}
          onClose={() => setIsFormVisible(false)}
          onSave={() => {
            setIsFormVisible(false);
            fetchProdutos();
          }}
        />
      )}
    </div>
  );
};

export default ProdutosPage;*/
