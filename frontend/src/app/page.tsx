import ShoppingList from '../components/ShoppingList';
import React from 'react';

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center">
       <ShoppingList />
    </main>
  );
}
