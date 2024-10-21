import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HamburgerMenu from '../components/HamburguerMenu';
import './globals.css';


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex flex-col min-h-screen bg-primary-1 app-layout">
        <header className="desktop-header">
          <Header />
        </header>
        <aside className="mobile-menu mt-2">
          <HamburgerMenu />
        </aside>
        {children}
        <Footer />
      </body>
    </html>
  );
}
