'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrashIcon, Pencil1Icon, ChevronUpIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/Pagination';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel, AlertDialogFooter } from '@/components/ui/alert-dialog';

interface Produto {
  id: number;
  nome: string;
  unidade: string;
}

interface Estoque {
  produto_id: number;
  quantidade_atual: number;
  produto: Produto;
}

const EstoquePage = () => {
  const [estoque, setEstoque] = useState<Estoque[]>([]);
  const [estoqueSelecionado, setEstoqueSelecionado] = useState<Estoque | null>(null);
  const [novaQuantidade, setNovaQuantidade] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 6;
  const [sortField, setSortField] = useState<keyof Produto>('nome');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const fetchEstoque = async () => {
    try {
        const response = await fetch('http://localhost:3000/estoque');
        const data = await response.json();

        const estoqueComProdutos = await Promise.all(
            data.map(async (item: Estoque) => {
                const produtoResponse = await fetch(`http://localhost:3000/produtos/${item.produto_id}`);
                const produtoData = await produtoResponse.json();
                return { ...item, produto: produtoData };
            })
        );

        setEstoque(estoqueComProdutos);
    } catch (error) {
        console.error('Erro ao buscar estoque:', error);
    }
};


  useEffect(() => {
    fetchEstoque();
  }, []);

  const ordenarEstoque = (field: keyof Produto, direction: 'asc' | 'desc') => {
    const sortedEstoque = [...estoque].sort((a, b) => {
      if (a.produto[field] < b.produto[field]) return direction === 'asc' ? -1 : 1;
      if (a.produto[field] > b.produto[field]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setEstoque(sortedEstoque);
  };

  const handleSort = (field: keyof Produto) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    ordenarEstoque(field, newDirection);
  };


  interface AlterarQuantidadeParams {
    id: number;
    novoProdutoId: number;
    novaQuantidade: number;
  }

  const alterarQuantidade = async ({ id, novoProdutoId, novaQuantidade }: AlterarQuantidadeParams): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3000/estoque/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          produto_id: novoProdutoId,
          quantidade_atual: novaQuantidade,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar quantidade: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Quantidade atualizada:', data);
    } catch (error) {
      console.error(error);
    }
  };

  

  const deletarEstoque = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/estoque/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchEstoque();
        setIsDeleteDialogOpen(false);
      } else {
        console.error('Erro ao excluir estoque:', await response.json());
      }
    } catch (error) {
      console.error('Erro ao excluir estoque:', error);
    }
  };

  const indexOfLastItem = paginaAtual * itensPorPagina;
  const indexOfFirstItem = indexOfLastItem - itensPorPagina;
  const estoqueAtual = estoque.slice(indexOfFirstItem, indexOfLastItem);
  const totalPaginas = Math.ceil(estoque.length / itensPorPagina);

  const renderMobileTable = () => (
    <div className="space-y-4">
      {estoqueAtual.map((item) => (
        <div
          key={item.produto_id}
          className="bg-white shadow-md rounded-lg p-4 cursor-pointer"
          onClick={() => setEstoqueSelecionado(item)}
        >
          <div className="flex justify-between">
            <span className="font-semibold text-lg">{item.produto.nome}</span>
            <Badge className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              {item.quantidade_atual}
            </Badge>
          </div>
          <div className="text-gray-500">{item.produto.unidade}</div>
          <div className="flex justify-between mt-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-neutral-0 text-primary-6 border-primary-2 hover:bg-primary-6 hover:text-neutral-1 flex items-center space-x-1">
                  <Pencil1Icon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Alterar Quantidade</DialogTitle>
                  <DialogDescription>Produto: {estoqueSelecionado?.produto.nome}</DialogDescription>
                </DialogHeader>
                <input
                  type="number"
                  value={novaQuantidade}
                  onChange={(e) => setNovaQuantidade(Number(e.target.value))}
                  className="border rounded p-2 w-full"
                />
                <DialogFooter>
                  <Button className="bg-red-500 text-neutral-0 hover:bg-red-600 hover:text-neutral-0" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                  <Button className="bg-primary-4 text-neutral-0 hover:bg-primary-5 hover:text-neutral-1" onClick={() => alterarQuantidade({ id: estoqueSelecionado?.produto_id!, novoProdutoId: estoqueSelecionado?.produto_id!, novaQuantidade })}>Confirmar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDesktopTable = () => (
    <Table className="bg-neutral-0 rounded-lg shadow-md overflow-hidden">
      <TableHeader>
        <TableRow>
          <th className="text-center cursor-pointer" onClick={() => handleSort('nome')}>
            Nome
            {sortField === 'nome' && (
              sortDirection === 'asc' ? (
                <ChevronUpIcon className="inline h-4 w-4 text-primary-6" />
              ) : (
                <ChevronDownIcon className="inline h-4 w-4 text-primary-6" />
              )
            )}
          </th>
          <th className="text-center cursor-pointer" >
            Quantidade Atual
           
          </th>
          <th className="text-center cursor-pointer" onClick={() => handleSort('unidade')}>
            Unidade
            {sortField === 'unidade' && (
              sortDirection === 'asc' ? (
                <ChevronUpIcon className="inline h-4 w-4 text-primary-6" />
              ) : (
                <ChevronDownIcon className="inline h-4 w-4 text-primary-6" />
              )
            )}
          </th>
          <th className="text-center">Ações</th>
        </TableRow>
      </TableHeader>
      <TableBody>
        {estoqueAtual.length > 0 ? (
          estoqueAtual.map((item) => (
            <TableRow
              key={item.produto_id}
              className="cursor-pointer"
              onClick={() => setEstoqueSelecionado(item)}
            >
              <TableCell className="text-center">{item.produto.nome}</TableCell>
              <TableCell className="text-center">{item.quantidade_atual}</TableCell>
              <TableCell className="text-center">{item.produto.unidade}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex items-center space-x-1">
                        <Pencil1Icon className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Alterar Quantidade</DialogTitle>
                        <DialogDescription>Produto: {item.produto.nome}</DialogDescription>
                      </DialogHeader>
                      <input
                        type="number"
                        value={novaQuantidade}
                        onChange={(e) => setNovaQuantidade(Number(e.target.value))}
                        className="border rounded p-2 w-full"
                      />
                      <DialogFooter>
                        <Button className="bg-red-500 text-neutral-0 hover:bg-red-600 hover:text-neutral-0" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button className="bg-primary-4 text-neutral-0 hover:bg-primary-5 hover:text-neutral-1" onClick={() => alterarQuantidade({ id: estoqueSelecionado?.produto_id!, novoProdutoId: estoqueSelecionado?.produto_id!, novaQuantidade })}>Confirmar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="bg-red-500 text-neutral-0 hover:bg-red-600 hover:text-neutral-0 flex items-center space-x-1">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Deseja excluir o estoque do produto {item.produto.nome}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deletarEstoque(item.produto_id)}>Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center">Nenhum estoque disponível</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Estoque</h1>
      {window.innerWidth < 768 ? renderMobileTable() : renderDesktopTable()}
      <Pagination
        currentPage={paginaAtual}
        totalPages={totalPaginas}
        onPageChange={setPaginaAtual}
      />
    </div>
  );
};

export default EstoquePage;
