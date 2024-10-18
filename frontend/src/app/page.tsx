import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-4">
        Mercadinho do Tuba
      </h1>
      <Image 
        src="/chef.png" 
        alt="Chef" 
        width={300} 
        height={300}
      />
      <p className="text-xl mt-4 text-center">
        Vem fazer tua feira, bença
      </p>
    </main>
  );
}
