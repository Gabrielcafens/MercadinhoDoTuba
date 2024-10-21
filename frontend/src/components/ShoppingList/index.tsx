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
  unidade: string; 
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

  const resetShoppingList = () => {
    setCart([]);
    setClienteSelecionado(null); 
    setSelectedCategory("");
    setSearchTerm("");
  };

  const handleCheckboxChange = (produtoId: string, isChecked: boolean) => {
    console.log(`Checkbox changed for productId: ${produtoId} to ${isChecked}`);
    if (!clienteSelecionado) {
      console.error("Cliente não selecionado. A checkbox não pode ser marcada.");
      return;
    }
  
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
      
      fetchProdutos();
      fetchCategorias();
      fetchEstoques();
      resetShoppingList();
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
    }
  };

  console.log("Filtered products:", filteredProdutos);

  return (
    <div className="w-full p-4 bg-primary-1 ">
      <h1 className="text-4xl font-bold text-center mb-4 text-primary-6">Lista de Compras</h1>

      <div >
        <h2 className="text-2xl mb-4 font-bold text-primary-5">Selecione o Cliente</h2>
        <ClienteCombobox onSelect={(cliente: { id: string; nome: string }) => {
          console.log("Cliente selecionado:", cliente);
          setClienteSelecionado(cliente);
        }} />
      </div>
      <div className="flex flex-col md:flex-row justify-between mt-2 bg-primary-1">
        <input
          type="text"
          placeholder="Buscar produto..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            console.log("Search term updated:", e.target.value);
          }}
          className="border-primary-6 p-2 bg-neutral-0 mb-2 text-neutral-1 w-full md:w-1/2 md:mr-2" 
        />
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            console.log("Category selected:", e.target.value);
          }}
          className="w-full md:w-auto" 
        >
          <option value="">Todas as categorias</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.nome}>
              {categoria.nome}
            </option>
          ))}
        </select>
      </div>


      <Table className="bg-primary-1">
        <TableHeader>
          <TableRow>
            <th className="text-left py-2 px-1"></th>
            <th className="text-left py-2 px-1">Produto</th>
            <th className="text-left py-2 px-1">Unidade</th>
            <th className="text-left py-2 px-1">Categoria</th>
            <th className="text-left py-2 px-1">Quantidade em Estoque</th>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProdutos.length > 0 ? (
            filteredProdutos.map((produto) => {
              const estoque = estoques.find((e) => e.produto_id === produto.id);
              const categoria = categorias.find(c => c.id === produto.categoria_id);
              return (
                <TableRow key={produto.id}>
                  <TableCell className="py-2 px-1">
                  <Checkbox
                      onCheckedChange={(isChecked) => handleCheckboxChange(produto.id, typeof isChecked === 'boolean' ? isChecked : false)}
                      disabled={!clienteSelecionado}
                    />
                  </TableCell>
                  <TableCell className="py-2 px-1">{produto.nome}</TableCell>
                  <TableCell className="py-2 px-1">{produto.unidade}</TableCell>
                  <TableCell className="py-2 px-1">{categoria?.nome || "Sem categoria"}</TableCell>
                  <TableCell className="py-2 px-1">{estoque ? estoque.quantidade_atual : 0}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Nenhum produto encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-between mt-6">
        <Cart 
            cart={cart} 
            clienteSelecionado={clienteSelecionado} 
            produtos={produtos} 
            onSubmit={handleSubmit}
            onCancel={() => {/*TODO lógica para cancelar */}} 
            onUpdateCart={setCart} 
          />
      </div>
    </div>
  );
};

export default ShoppingList;
