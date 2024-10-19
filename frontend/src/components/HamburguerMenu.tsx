'use client';

import { useState } from 'react';
import { Button } from '../components/ui/button';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/sheet';

const HamburguerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost">
            <HamburgerMenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-primary-2 text-neutral-1">
          <SheetHeader>
            <SheetTitle className="text-neutral-1">Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-4 mt-4">
            <Button variant="link" asChild>
              <a href="#produtos" className="text-neutral-1 hover:text-primary-4">Produtos</a>
            </Button>
            <Button variant="link" asChild>
              <a href="#clientes" className="text-neutral-1 hover:text-primary-4">Clientes</a>
            </Button>
            <Button variant="link" asChild>
              <a href="#pedidos" className="text-neutral-1 hover:text-primary-4">Pedidos</a>
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HamburguerMenu;
