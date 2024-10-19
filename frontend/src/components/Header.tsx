'use client';

import Link from 'next/link';
import { Button } from '../components/ui/button';

interface HeaderProps {
  title?: string;
}

const Header = ({ title = "Mercadinho do Tuba" }: HeaderProps) => {
  return (
    <header className="w-full p-7 sticky top-0 z-30 bg-primary-2">
      <div className="flex items-center justify-between" id="navbar">
        <div id="nav_logo" className="text-2xl text-primary-6">
          {title}
        </div>
        <nav className="hidden md:flex" id="nav_list">
          <ul className="flex gap-12">
            <li className="nav-item">
              <Button variant="link" asChild>
                <Link href="#produtos" className="text-neutral-1 hover:text-primary-6">Produtos</Link>
              </Button>
            </li>
            <li className="nav-item">
              <Button variant="link" asChild>
                <Link href="#clientes" className="text-neutral-1 hover:text-primary-6">Clientes</Link>
              </Button>
            </li>
            <li className="nav-item">
              <Button variant="link" asChild>
                <Link href="/pedidos" className="text-neutral-1 hover:text-primary-6">
                  Pedidos
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
