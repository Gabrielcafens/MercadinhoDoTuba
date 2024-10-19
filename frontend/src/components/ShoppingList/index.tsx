"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { ClienteCombobox } from "@/components/ClienteCombobox";
import Cart from "@/components/Cart";
import { Checkbox } from "@/components/ui/checkbox";

interface Produto {
  id: string;
  nome: string;
  categoria_id: string;
}

interface Categoria {
  id: string;
  nome: string;
}

interface Estoque {
  produto_id: string;
  quantidade_atual: number;
}

const ShoppingList = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [estoques, setEstoques] = useState<Estoque[]>([]);
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [clienteSelecionado, setClienteSelecionado] = useState<{ id: string; nome: string } | null>(null);

  useEffect(() => {
    fetchProdutos();
    fetchCategorias();
    fetchEstoques();
  }, []);

  const fetchProdutos = async () => {
    try {
      const response = await fetch("http://localhost:3000/produtos");
      const data = await response.json();
      console.log("Produtos fetched:", data);
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch("http://localhost:3000/categorias");
      const data = await response.json();
      console.log("Categorias fetched:", data);
      setCategorias(data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  const fetchEstoques = async () => {
    try {
      const response = await fetch("http://localhost:3000/estoque");
      const data = await response.json();
      console.log("Estoques fetched:", data);
      setEstoques(data);
    } catch (error) {
      console.error("Erro ao buscar estoques:", error);
    }
  };

  const handleProductSelect = (produtoId: string, quantity: number) => {
    console.log(`Product selected: ${produtoId} with quantity: ${quantity}`);
    if (clienteSelecionado) {
      setCart((prev) => {
        const existingItem = prev.find((item) => item.productId === produtoId);
        if (existingItem) {
          return prev.map((item) =>
            item.productId === produtoId ? { ...item, quantity } : item
          );
        } else {
          return [...prev, { productId: produtoId, quantity }];
        }
      });
    }
  };

  const handleQuantityChange = (produtoId: string, quantity: number) => {
    console.log(`Quantity changed for productId: ${produtoId} to ${quantity}`);
    if (clienteSelecionado) {
      handleProductSelect(produtoId, quantity);
    }
  };

  const handleCheckboxChange = (produtoId: string, isChecked: boolean) => {
    console.log(`Checkbox changed for productId: ${produtoId} to ${isChecked}`);
    if (isChecked) {
      handleProductSelect(produtoId, 1);
    } else {
      setCart((prev) => prev.filter((item) => item.productId !== produtoId));
    }
  };

  const filteredProdutos = produtos.filter(
    (produto) =>
      (selectedCategory === "" || categorias.find(c => c.id === produto.categoria_id)?.nome === selectedCategory) &&
      (searchTerm === "" || produto.nome.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const handleSubmit = async () => {
    if (!clienteSelecionado || cart.length === 0) {
      console.error("Cliente não selecionado ou carrinho vazio.");
      return;
    }

    const pedido = {
      cliente_id: clienteSelecionado.id,
      data_pedido: new Date().toISOString().split("T")[0],
      status: "pendente",
    };
  
    try {
      console.log("Enviando o seguinte pedido para a API:", pedido);
      const pedidoResponse = await fetch("http://localhost:3000/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pedido),
      });
  
      if (!pedidoResponse.ok) {
        throw new Error("Erro ao registrar pedido");
      }
  
      const { id: pedidoId } = await pedidoResponse.json();
      console.log("Pedido registrado com ID:", pedidoId);
  
      for (const item of cart) {
        const itemPedido = {
          pedido_id: pedidoId,
          produto_id: item.productId,
          quantidade: item.quantity,
        };
  
        console.log("Enviando o seguinte item para a API:", itemPedido);
        const itemResponse = await fetch("http://localhost:3000/itens_pedido", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemPedido),
        });
  
        if (!itemResponse.ok) {
          throw new Error("Erro ao registrar item do pedido");
        }
  
        const estoqueUpdate = {
          produto_id: item.productId,
          quantidade_atual: item.quantity,
        };
  
        const estoqueResponse = await fetch(`http://localhost:3000/estoque?produto_id=${item.productId}`);
        const estoqueData = await estoqueResponse.json();
  
        if (estoqueData.length > 0) {
          const estoqueId = estoqueData[0].id;
          console.log("Atualizando o estoque com os seguintes dados:", {
            id: estoqueId,
            ...estoqueUpdate,
          });
          const atualizarEstoqueResponse = await fetch(`http://localhost:3000/estoque/${estoqueId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(estoqueUpdate),
          });
  
          if (!atualizarEstoqueResponse.ok) {
            throw new Error("Erro ao atualizar estoque");
          }
        } else {
          console.error("Estoque não encontrado para o produto:", item.productId);
        }
      }
  
      console.log("Pedido e itens registrados com sucesso");
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
    }
  };

  console.log("Filtered products:", filteredProdutos);

  return (
    <div className="w-full p-6">
      <h1 className="text-4xl font-bold text-center mb-4">Lista de Compras</h1>

      <div className="mb-4">
        <h2 className="text-2xl font-bold">Confirme o Cliente</h2>
        <ClienteCombobox onSelect={(cliente: { id: string; nome: string }) => {
          console.log("Cliente selecionado:", cliente);
          setClienteSelecionado(cliente);
        }} />
      </div>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar produto..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            console.log("Search term updated:", e.target.value);
          }}
          className="border border-neutral-1 p-2 rounded bg-neutral-0 text-neutral-1"
        />
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            console.log("Category selected:", e.target.value);
          }}
          className="border border-neutral-1 p-2 rounded bg-neutral-0 text-neutral-1"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.nome}>
              {categoria.nome}
            </option>
          ))}
        </select>
      </div>

      <Table className="bg-neutral-0">
        <TableHeader>
          <TableRow>
            <th className="text-left"></th>
            <th className="text-left">Produto</th>
            <th className="text-left">Quantidade em Estoque</th>
            <th className="text-left">Quantidade</th>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProdutos.length > 0 ? (
            filteredProdutos.map((produto) => {
              const estoque = estoques.find((e) => e.produto_id === produto.id);
              return (
                <TableRow key={produto.id}>
                  <TableCell className="text-left">
                    <label className="custom-checkbox">
                      <Checkbox
                        disabled={!clienteSelecionado}
                        onCheckedChange={(checked) => handleCheckboxChange(produto.id, checked as boolean)}
                        style={{
                          backgroundColor: clienteSelecionado ? (cart.some(item => item.productId === produto.id) ? 'var(--color-primary-6)' : 'var(--color-primary-1)') : 'var(--color-neutral-1)',
                          borderColor: clienteSelecionado ? (cart.some(item => item.productId === produto.id) ? 'var(--color-primary-6)' : 'var(--color-neutral-1)') : 'var(--color-neutral-1)',
                          color: clienteSelecionado && cart.some(item => item.productId === produto.id) ? '#ffffff' : 'transparent',
                          transition: 'background-color 0.3s, border-color 0.3s',
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                          if (!clienteSelecionado) {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-primary-1)';
                          }
                        }}
                        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                          if (!clienteSelecionado) {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                          }
                        }}
                      />
                    </label>
                  </TableCell>
                  <TableCell className="text-left">{produto.nome}</TableCell>
                  <TableCell className="text-left">{estoque ? estoque.quantidade_atual : 0}</TableCell>
                  <TableCell className="text-left">
                    <input
                      type="number"
                      min={1}
                      max={estoque ? estoque.quantidade_atual : 0}
                      onChange={(e) => handleQuantityChange(produto.id, Number(e.target.value))}
                      disabled={!clienteSelecionado}
                      className="border border-neutral-1 p-1 rounded w-20"
                    />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">Nenhum produto encontrado</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {clienteSelecionado && cart.length > 0 && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold">Carrinho</h2>
          <Cart 
            cart={cart} 
            clienteSelecionado={clienteSelecionado} 
            produtos={produtos} 
            onSubmit={handleSubmit}
            onCancel={() => {/*TODO lógica para cancelar */}} 
            onUpdateCart={setCart} 
          />
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
