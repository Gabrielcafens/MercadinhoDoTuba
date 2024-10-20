"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CartItem {
  productId: string;
  quantity: number;
}
interface Produto {
  id: string;
  nome: string;
  categoria_id: string;
  unidade: string;
}

interface CartProps {
  cart: CartItem[];
  produtos: Produto[];
  clienteSelecionado: { id: string; nome: string } | null;
  onSubmit: () => void;
  onCancel: () => void;
  onUpdateCart: (updatedCart: CartItem[]) => void;
}

const Cart = ({ cart, produtos, clienteSelecionado, onSubmit, onCancel, onUpdateCart }: CartProps) => {
  const gerarResumoPedido = () => {
    const resumo = cart
      .map((item) => {
        const produto = produtos.find((p) => p.id === item.productId);
        const unidadePlural = item.quantity > 1 ? `${produto?.unidade}s` : produto?.unidade;
        return produto 
          ? `${produto.nome} - Quantidade: ${item.quantity} ${unidadePlural}` 
          : 'Produto Desconhecido';
      })
      .join("\n");
  
    return resumo;
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    console.log(`Updating quantity for productId: ${productId} to ${newQuantity}`);
    const updatedCart = cart.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    onUpdateCart(updatedCart);
  };

  console.log("Cart Props:", { cart, produtos, clienteSelecionado });

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold">Carrinho</h2>
      {cart.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <th className="text-left">Produto</th>
              <th className="text-left">Quantidade</th>
              <th className="text-left">Unidade</th>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.map((item) => {
              const produto = produtos.find((p) => p.id === item.productId);
              return (
                <TableRow key={item.productId}>
                  <TableCell className="text-left">
                    {produto ? produto.nome : 'Produto Desconhecido'}
                  </TableCell>
                  <TableCell className="text-left">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.productId, Number(e.target.value))}
                      className="border border-neutral-1 p-1 rounded w-20"
                    />
                  </TableCell>
                  <TableCell className="text-left"> 
                    {produto ? produto.unidade : 'N/A'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <p>Nenhum item no carrinho.</p>
      )}
      {clienteSelecionado && cart.length > 0 && (
        <div className="mt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-primary-4 text-neutral-0 hover:bg-primary-5">
                Finalizar Pedido
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-neutral-0 text-neutral-1">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-primary-6">Resumo do Pedido</AlertDialogTitle>
                <AlertDialogDescription>
                  <strong>Cliente:</strong> {clienteSelecionado.nome}
                  <br />
                  <strong>Itens:</strong>
                  <div className="whitespace-pre-wrap">{gerarResumoPedido()}</div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-primary-2 text-neutral-0 hover:bg-primary-3" onClick={onCancel}>
                  Cancelar Pedido
                </AlertDialogCancel>
                <AlertDialogAction className="bg-primary-4 text-neutral-0 hover:bg-primary-5" onClick={onSubmit}>
                  Registrar Pedido
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};

export default Cart;
