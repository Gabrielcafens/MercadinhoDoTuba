'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrashIcon, Pencil1Icon, ChevronUpIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Pagination from '@/components/Pagination';

interface Pedido {
  id: number;
  cliente_id: number;
  cliente_nome: string;
  data_pedido: string;
  status: string;
  produtos: Produto[];
}

interface Produto {
  id: number;
  nome: string;
  quantidade: number;
}

const PedidosPage = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [novoStatus, setNovoStatus] = useState<string>('pendente');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const pedidosPorPagina = 6;

  const [sortField, setSortField] = useState<keyof Pedido>('data_pedido');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const fetchPedidos = async () => {
    try {
      const response = await fetch('http://localhost:3000/pedidos');
      const data = await response.json();

      const pedidosComClientes = await Promise.all(
        data.map(async (pedido: Pedido) => {
          const clienteResponse = await fetch(`http://localhost:3000/clientes/${pedido.cliente_id}`);
          const clienteData = await clienteResponse.json();
          return { ...pedido, cliente_nome: clienteData.nome };
        })
      );

      setPedidos(pedidosComClientes);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const ordenarPedidos = (field: keyof Pedido, direction: 'asc' | 'desc') => {
    const sortedPedidos = [...pedidos].sort((a, b) => {
      if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortedPedidos;
  };
  const handleSort = (field: keyof Pedido) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    const sortedPedidos = ordenarPedidos(field, newDirection);
    setPedidos(sortedPedidos);
  };

  const alterarStatus = async () => {
    if (!pedidoSelecionado) return;
  
    const { cliente_id, data_pedido, produtos } = pedidoSelecionado;
  
    const updatedPedido = {
      cliente_id,
      data_pedido,
      status: novoStatus,
    };
  
    try {
      const response = await fetch(`http://localhost:3000/pedidos/${pedidoSelecionado.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPedido),
      });
  
      if (response.ok) {
        // Atualiza os produtos se o status for "entregue"
        if (novoStatus === 'entregue' && Array.isArray(produtos)) {
          await Promise.all(
            produtos.map(produto => {
              return fetch(`http://localhost:3000/produtos/${produto.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantidade: produto.quantidade - 1 }),
              });
            })
          );
        }
  
        // Chama a função para buscar pedidos atualizados
        fetchPedidos();
  
        setPedidoSelecionado(null);
        setIsDialogOpen(false);
      } else {
        console.error('Erro ao atualizar status:', await response.json());
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const deletarPedido = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/pedidos/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log(`Pedido ${id} deletado com sucesso.`);
        fetchPedidos();
      } else {
        console.error('Erro ao deletar pedido:', response.status);
      }
    } catch (error) {
      console.error('Erro ao deletar pedido:', error);
    }
  };

  const indexOfLastPedido = paginaAtual * pedidosPorPagina;
  const indexOfFirstPedido = indexOfLastPedido - pedidosPorPagina;
  const pedidosAtuais = pedidos.slice(indexOfFirstPedido, indexOfLastPedido);
  const totalPaginas = Math.ceil(pedidos.length / pedidosPorPagina);

  const renderMobileTable = () => (
    <div className="space-y-4">
      {pedidosAtuais.map((pedido) => (
        <div
          key={pedido.id}
          className="bg-white shadow-md rounded-lg p-4 cursor-pointer"
          onClick={() => setPedidoSelecionado(pedido)}
        >
          <div className="flex justify-between">
            <span className="font-semibold text-lg">{pedido.cliente_nome}</span>
            <Badge
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                pedido.status === 'pendente'
                  ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  : 'bg-primary-4 text-neutral-0 hover:bg-primary-5'
              }`}
            >
              {pedido.status}
            </Badge>
          </div>
          <div className="text-gray-500">{new Date(pedido.data_pedido).toLocaleString()}</div>
          <div className="flex justify-between mt-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-neutral-0 text-primary-6 border-primary-2 hover:bg-primary-6 hover:text-neutral-1 flex items-center space-x-1">
                  <Pencil1Icon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Alterar Status</DialogTitle>
                  <DialogDescription>Selecione o novo status do pedido.</DialogDescription>
                </DialogHeader>
                <Select onValueChange={setNovoStatus} defaultValue={pedido.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="entregue">Entregue</SelectItem>
                  </SelectContent>
                </Select>
                <DialogFooter>
                  <Button className="bg-red-500 text-neutral-0 hover:bg-red-600 hover:text-neutral-0" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                  <Button className="bg-primary-4 text-neutral-0 hover:bg-primary-5 hover:text-neutral-1" onClick={alterarStatus}>Confirmar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} className="bg-red-500 text-neutral-0 hover:bg-red-600 hover:text-neutral-0">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>Você tem certeza que deseja excluir este pedido?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-red-500 text-neutral-0 hover:bg-red-600" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction className="bg-primary-4 text-neutral-0 hover:bg-primary-5 hover:text-neutral-1" onClick={() => deletarPedido(pedido.id)}>Excluir</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDesktopTable = () => (
    <Table className="bg-neutral-0 rounded-lg shadow-md overflow-hidden">
      <TableHeader>
      <TableRow>
      <th className="text-center cursor-pointer" onClick={() => handleSort('cliente_nome')}>
            Cliente
            {sortField === 'cliente_nome' && (
              sortDirection === 'asc' ? (
                <ChevronUpIcon className="inline h-4 w-4 text-primary-6" />
              ) : (
                <ChevronDownIcon className="inline h-4 w-4 text-primary-6" />
              )
            )}
          </th>
          <th className="text-center cursor-pointer" onClick={() => handleSort('data_pedido')}>
            Data do Pedido
            {sortField === 'data_pedido' && (
              sortDirection === 'asc' ? (
                <ChevronUpIcon className="inline h-4 w-4 text-primary-6" />
              ) : (
                <ChevronDownIcon className="inline h-4 w-4 text-primary-6" />
              )
            )}
          </th>
          <th className="text-center cursor-pointer" onClick={() => handleSort('status')}>
            Status
            {sortField === 'status' && (
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
        {pedidosAtuais.length > 0 ? (
          pedidosAtuais.map((pedido) => (
            <TableRow
              key={pedido.id}
              className="cursor-pointer"
              onClick={() => setPedidoSelecionado(pedido)}
            >
              <TableCell className="text-center">{pedido.cliente_nome}</TableCell>
              <TableCell className="text-center">{new Date(pedido.data_pedido).toLocaleString()}</TableCell>
              <TableCell className="text-center">
                <Badge
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    pedido.status === 'pendente'
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      : 'bg-primary-4 text-neutral-0 hover:bg-primary-5'
                  }`}
                >
                  {pedido.status}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-center space-x-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-neutral-0 text-primary-6 border-primary-2 hover:bg-primary-6 hover:text-neutral-1 flex items-center space-x-1">
                      <Pencil1Icon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Alterar Status</DialogTitle>
                      <DialogDescription>Selecione o novo status do pedido.</DialogDescription>
                    </DialogHeader>
                    <Select onValueChange={setNovoStatus} defaultValue={pedido.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="entregue">Entregue</SelectItem>
                      </SelectContent>
                    </Select>
                    <DialogFooter>
                      <Button className="bg-red-500 text-neutral-0 hover:bg-red-600 hover:text-neutral-0" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                      <Button className="bg-primary-4 text-neutral-0 hover:bg-primary-5 hover:text-neutral-1" onClick={alterarStatus}>Confirmar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} className="bg-red-500 text-neutral-0 hover:bg-red-600 hover:text-neutral-0">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>Você tem certeza que deseja excluir este pedido?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-red-500 text-neutral-0 hover:bg-red-600" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
                      <AlertDialogAction className="bg-primary-4 text-neutral-0 hover:bg-primary-5 hover:text-neutral-1" onClick={() => deletarPedido(pedido.id)}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              Nenhum pedido encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold m-6">Pedidos</h1>
      <div className="block md:hidden">
        {renderMobileTable()}
      </div>
      <div className="hidden md:block">
        {renderDesktopTable()}
      </div>
      <Pagination 
        currentPage={paginaAtual} 
        totalPages={totalPaginas} 
        onPageChange={setPaginaAtual} 
      />
    </div>
  );
};

export default PedidosPage;
