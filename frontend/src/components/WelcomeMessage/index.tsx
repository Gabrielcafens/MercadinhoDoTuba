"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

const WelcomeMessage = () => {
  const [isOpen, setIsOpen] = useState(true); 

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="hidden" />
      </SheetTrigger>
      <SheetContent side="bottom" className="bg-primary-1 text-neutral-1 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <Image src="/chef.png" alt="Tuba" width={200} height={200} className="mb-4" />
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-primary-6 mb-4">
              Bem-vindo ao Mercadinho do Tuba!
            </SheetTitle>
          </SheetHeader>
          <p className="mb-4">
            Controle a lista de compras dos seus clientes, anote pedidos e gerencie dados de clientes. 
            <strong>Funções prontas:</strong> Compras, Pedidos e Clientes. 
            <strong>Em desenvolvimento:</strong> Produtos e Estoque.
          </p>
          <p className="mb-4">
            Para usar a lista de compras, selecione o cliente e os produtos. Altere a quantidade e finalize o pedido. Após a finalização, você pode alterar o status de "pendente" para "entregue".
          </p>
          <Button variant="default" onClick={handleClose} className="mt-4 bg-primary-6 text-neutral-0">
            Fechar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WelcomeMessage;
