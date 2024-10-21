'use client';

import { useState } from 'react';
import { Button } from '../components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/sheet';
import Link from 'next/link'; 
import Image from 'next/image';

const HamburguerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden bg-primary-1">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="flex items-center">
            <Image src="/favicon.ico" alt="Menu" width={44} height={44} />
            <span className="ml-2 text-primary-6 text-lg font-bold">Mercadinho do Tuba</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-primary-1 text-neutral-1">
          <SheetHeader>
            <SheetTitle className="text-neutral-1">Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-4 mt-4">
            <Button variant="link" asChild>
              <Link href="/clientes" className="text-neutral-1 hover:text-primary-4">
                Clientes
              </Link>
            </Button>
            <Button variant="link" asChild>
              <Link href="/pedidos" className="text-neutral-1 hover:text-primary-4">
                Pedidos
              </Link>
            </Button>
            <Button variant="link" asChild>
              <Link href="/produtos" className="text-neutral-1 hover:text-primary-4">
                Produtos
              </Link>
            </Button>
            <Button variant="link" asChild>
              <Link href="/estoque" className="text-neutral-1 hover:text-primary-4">
                Estoque
              </Link>
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HamburguerMenu;
