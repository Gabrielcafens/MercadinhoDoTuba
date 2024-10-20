import EstoqueForm from '@/components/EstoqueForm';
import React, { useEffect, useState } from 'react';

type EstoqueItem = {
  id: number;
  produto_id: number;
  quantidade_atual: number;
};

const EstoquePage = () => {
    const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [estoqueSelecionado, setEstoqueSelecionado] = useState<EstoqueItem | undefined>(undefined);
    const [produtos, setProdutos] = useState<{ id: number; nome: string }[]>([]);
  
    const fetchEstoque = async () => {
      const response = await fetch('http://localhost:3000/estoque');
      const data = await response.json();
      setEstoque(data);
    };
  
    const fetchProdutos = async () => {
      const response = await fetch('http://localhost:3000/produtos');
      const data = await response.json();
      setProdutos(data);
    };
  
    const handleAddEstoque = () => {
      setEstoqueSelecionado(undefined);
      setIsFormVisible(true);
    };
  
    const handleEditEstoque = (estoqueItem: EstoqueItem) => {
      setEstoqueSelecionado(estoqueItem);
      setIsFormVisible(true);
    };
  
    const handleDeleteEstoque = async (id: number): Promise<void> => {
      await fetch(`http://localhost:3000/estoque/${id}`, { method: 'DELETE' });
      fetchEstoque();
    };
  
    useEffect(() => {
      fetchEstoque();
      fetchProdutos();
    }, []);
  
    return (
      <div>
        <h1>Estoque</h1>
        <button onClick={handleAddEstoque}>Adicionar Estoque</button>
  
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Produto</th>
              <th>Quantidade Atual</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {estoque.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{produtos.find(prod => prod.id === item.produto_id)?.nome}</td>
                <td>{item.quantidade_atual}</td>
                <td>
                  <button onClick={() => handleEditEstoque(item)}>Editar</button>
                  <button onClick={() => handleDeleteEstoque(item.id)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {isFormVisible && (
          <EstoqueForm
            estoque={estoqueSelecionado ?? undefined}
            produtos={produtos}
            onClose={() => setIsFormVisible(false)}
            onSave={() => {
              setIsFormVisible(false);
              fetchEstoque();
            }}
          />
        )}
      </div>
    );
  };
  
  export default EstoquePage;
  
